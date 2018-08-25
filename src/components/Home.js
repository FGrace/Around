import React from 'react';
import $ from 'jquery';
import {Tabs, Button, Spin} from 'antd';
import {GEO_OPTIONS, POS_KEY, API_ROOT, TOKEN_KEY,AUTH_HEADER} from '../constants';
import {Gallery} from './Gallery';
import {CreatePostButton} from './CreatePostButton';
import {WrappedAroundMap} from './AroundMap';


export class Home extends React.Component{

    state = {
        loadingGeoLocation: false,
        loadingPost:false,
        error:"",
        posts:'',
    }

   /*start loading images after UI has been rendered */
    componentDidMount(){
        this.setState({loadingGeoLocation:true});
        this.getGeolocation();

    }

    getGeolocation = () => {
        if ("geolocation" in navigator) {
            /* geolocation is available */
            navigator.geolocation.getCurrentPosition(this.onSuccessLoadGeoLocation,this.onFailLoadGeoLocation,GEO_OPTIONS,)
        } else {
            /* geolocation IS NOT available */
            this.setState({loadingGeoLocation:false, error: 'Your browser does not support geolocation'});
        }
    }

    onSuccessLoadGeoLocation = (position) => {
        this.setState({loadingGeoLocation:false});
        console.log(position);
        const {latitude,longitude} = position.coords;
        localStorage.setItem(POS_KEY,JSON.stringify({lat:latitude, lon: longitude}));
        this.loadNearbyPost();
    }

    loadNearbyPost = (location,radius) => {
        this.setState({loadingPost:true, error:''});
        /*deserialize JSON */
        /*deStructuring */
       const {lat, lon} = location ? location : JSON.parse(localStorage.getItem(POS_KEY));
       const token = localStorage.getItem(TOKEN_KEY);
       const range = radius ? radius : 20;
       $.ajax({
           url:`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${range}`,
           method:'GET',
           headers:{
               Authorization:`${AUTH_HEADER} ${token}`,
           },
       }).then((response) =>
       {
           const posts = response ? response : [];
           this.setState({posts: posts,loadingPost:false,error: ''});
           console.log(response);
       }, (error) => {
           this.setState({ loadingPosts: false, error: error.responseText });
           console.log(error.responseText);
       }).catch((e) => {
           console.log(e);
       });
    }

    onFailLoadGeoLocation = () => {
        this.setState({loadingGeoLocation:false, error:'failed to load geolocation.'});
        console.log('failed to load geolocation.');

    }

    getPanelContent = (type) => {
        if(this.state.error){
            return <div>{this.state.error}</div>;
        } else if(this.state.loadingGeoLocation){
            return <Spin tip = 'loading geolocation...'/>;
        } else if (this.state.posts && this.state.posts.length > 0) {
            //get the images from posts and map
           return  type === 'image' ? this.getImagePosts() : this.getVideoPosts();
        } else {
                return <div>Found Nothing</div>;

        }
    }

    getImagePosts = () => {
        const images = this.state.posts
            .filter((post) => post.type === 'image')
            .map((post) => {
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                    caption: post.message,
                }
            });
        return <Gallery images={images}/>;
    }

    getVideoPosts = () => {
        return this.state.posts.filter((post) => post.type === 'video')
            .map((post) => <video src = {post.url} key = {post.url}/>);
    }

    render(){
        const operations = <CreatePostButton loadNearbyPost = {this.loadNearbyPost}/>;
        const TabPane = Tabs.TabPane;

        return(
            <Tabs tabBarExtraContent={operations} className="main-tabs">
                <TabPane tab="Image Post" key="1">
                    {this.getPanelContent('image')}
                </TabPane>
                <TabPane tab="Video Post" key="2">
                    {this.getPanelContent('video')}
                    </TabPane>
                <TabPane tab="Map" key="3">
                    <WrappedAroundMap
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD3CEh9DXuyjozqptVB5LA-dN7MxWWkr9s&v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `400px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        posts={this.state.posts}
                        loadNearbyPost = {this.loadNearbyPost}
                    />
                </TabPane>
            </Tabs>
        );
    }
}
