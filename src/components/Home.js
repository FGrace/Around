import React from 'react';
import {Tabs, Button} from 'antd';
import {GEO_OPTIONS} from '../constants';


export class Home extends React.Component{

   /*start loading images after UI has been rendered */
    componentDidMount(){
        this.getGeolocation();

    }

    getGeolocation = () => {
        if ("geolocation" in navigator) {
            /* geolocation is available */
            navigator.geolocation.getCurrentPosition(this.onSuccessLoadGeoLocation,this.onFailLoadGeoLocation,GEO_OPTIONS,)
        } else {
            /* geolocation IS NOT available */
        }

    }

    onSuccessLoadGeoLocation = (position) => {
        console.log(position);
        const {latitude,longitude} = position.coords;

        localStorage.setItem('POS_KEY',JSON.stringify({lat:latitude, lon: longitude}));
    }

    onFailLoadGeoLocation = () => {
        console.log('failed to load geolocation.');


    }

    render(){
        const operations = <Button type = "primary"> Create New Post</Button>;
        const TabPane = Tabs.TabPane;

        return(
            <Tabs tabBarExtraContent={operations} className="main-tabs">
                <TabPane tab="Image Post" key="1">Content of tab 1</TabPane>
                <TabPane tab="Video Post" key="2">Content of tab 2</TabPane>
                <TabPane tab="Map" key="3">Content of tab 3</TabPane>
            </Tabs>
        );
    }
}
