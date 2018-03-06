/**
 * Probe Mobile - High Concurrency request for mobile.
 * https://github.com/chenxianming/Probe-Mobile
 * @cXm
 */

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    PixelRatio,
    Alert,
    Switch,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ToastAndroid,
    Animated,
    PanResponder,
    Easing
} from 'react-native';

const Dimensions = require('Dimensions');

const ratio = PixelRatio.get(),
    width = Dimensions.get('window').width,
    height = Dimensions.get('window').height,
    rem = Dimensions.get('window').width/16;

const axios = require('axios');

const async = require('async');

const randomStr = (len) => {
    var len = len || 8,
        arr = 'qwertyuiopasdfghjklzxcvbnm1234567890'.split(''),
        chunk = '';
    
    for(let i = 0;i<len;i++){
        chunk += arr[ ~~(Math.random() * arr.length) ];
    }
    
    return chunk;
};

//set remove fn to Array prototype link
Array.prototype.remove = function(a){
    for (var i = this.length - 1; i >= 0; --i) {
        if (this[i] === a) {
            this.splice(i, 1);
        }
    }
    
    return this;
};

type Props = {};

const Components = {},
      platform = Platform.OS,
      iconName = (platform=='ios') ? 'Material Icons' : 'materialIcons',
      fontName = (platform=='ios') ? 'PierSans-Regular' : 'pier',
      randomFields = [],
      taskPaused = false;

const dialog = (str) => {
    var str = (typeof(str) == 'string') ? str : str.toString();
    
    (platform=='ios') ? Alert.alert('',str) : ToastAndroid.show(str, ToastAndroid.SHORT);
}

export default class App extends Component<Props> {
    constructor(props){
        super(props);
        
        this.state = {}
    }
    
    componentWillMount(){
        
    }
    
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.main}>
                    <Header />
                    <ScrollView style={styles.mainContainer}>
                        <SwitchRequestType />
                        <RequestUrl />
                        <CustomHeaders />
                        <RequestData />
                        <RequestOption />
                        <SendRequest />
                    </ScrollView>
                </View>
                <Terminal />
            </View>
        );
    }
}

class CheckBox extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            isCheck:false
        }
    }
    
    check(){
        const isCheck = !this.state.isCheck;
        
        this.setState({
            isCheck:isCheck
        });
        
        if(this.props.onChange){
            this.props.onChange(isCheck);
        }
    }
    
    render(){
        return (
            <TouchableOpacity onPress={ e => { this.check() } } activeOpacity={.7} style={styles.lineItemContentMainLineRandomCheck}>
                <Text style={[styles.lineItemContentMainLineRandomCheckIcon,styles.icon]}>{ this.state.isCheck ? '' : '' }</Text>
            </TouchableOpacity>
        )
    }
}

class Header extends Component{
    render(){
        return (
            <View style={styles.headers}>
                <View style={styles.headersSlogan}>
                    <Text style={[styles.headersIcon,styles.icon]}></Text>
                    <Text style={[styles.headersIconText]}>ProbeMobile</Text>
                </View>
                <Text style={[styles.headersSloganText]}>High Concurrency request for mobile.</Text>
            </View>
        )
    }
}

class SwitchRequestType extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            value:false,
            method:'GET'
        }
    }
    
    componentWillMount(){
        Components.switchRequestType = this;
    }
    
    onChange(e){
        this.setState({
            value:e,
            method:(e ? 'POST' : 'GET')
        });
        
        Components.sendRequest.setData('method',(e ? 'POST' : 'GET'));
        
        Components.sendRequest.setPostType( e ? 'application/x-www-form-urlencoded' : false );
    }
    
    render(){
        return (
            <View style={styles.switcher}>
                <View style={styles.switcherItem}>
                    <Text style={styles.switcherItemTitle}>Switch Method</Text>
                    <View style={styles.switcherItemContent}>
                        <Switch value={this.state.value} onValueChange={ e => this.onChange(e) } thumbTintColor={'#2f2f2f'} tintColor={'#cacaca'} onTintColor={'#cacaca'} style={styles.swtichBtn} />
                        <Text style={styles.displayFontMiddle}>{ this.state.method }</Text>
                    </View>
                </View>
                <SwitchPostBodyType display={ this.state.method == 'POST' ? true : false } />
            </View>
        )
    }
}

class SwitchPostBodyType extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            value:false,
            isDisplay:props.display,
            type:'application/x-www-form-urlencoded',//['application/x-www-form-urlencoded','application/json']
        }
    }
    
    componentWillReceiveProps(props){
        this.setState({
            isDisplay:props.display
        });
    }
    
    componentWillMount(){
        Components.switchPostBodyType = this;
    }
    
    onChange(e){
        this.setState({
            value:e,
            type:(e ? 'application/json' : 'application/x-www-form-urlencoded')
        });
        
        Components.sendRequest.setPostType( (e ? 'application/json' : 'application/x-www-form-urlencoded') );
    }
    
    render(){
        
        if(!this.state.isDisplay){
            return (<View></View>);
        }
        
        return (
            <View style={styles.switcherItem}>
                <Text style={styles.switcherItemTitle}>Switch Method</Text>
                <View style={styles.switcherItemContent}>
                    <Switch style={styles.swtichBtn} value={this.state.value} onValueChange={ e => this.onChange(e) } thumbTintColor={'#2f2f2f'} tintColor={'#cacaca'} onTintColor={'#cacaca'} />
                    <Text style={styles.displayFontMiddle}>{ this.state.type }</Text>
                </View>
            </View>
        );
    }
    
}

class RequestUrl extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            url:''
        }
    }
    
    componentWillMount(){
        Components.requestUrl = this;
    }
    
    setValue(text){
        
        this.setState({
            url:text
        });
        
        Components.sendRequest.setData('url',text);
    }
    
    render(){
        
        return (
            <View style={styles.lineItem}>
                <Text style={[styles.switcherItemTitle,styles.mbl]}>Request URL</Text>
                <View style={styles.lineItemContent}>
                    <View style={styles.lineItemContentMain}>
                        <TextInput underlineColorAndroid={'transparent'} placeholderTextColor={'rgba(47,47,47,.6)'} style={styles.lineItemContentMainFull} value={ this.state.url } placeholder="Request URL" onChangeText={ (text) => { this.setValue(text) } } />
                    </View>
                </View>
            </View>
        );
    }
}

class CustomHeaders extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            headers:[
                {}
            ]
        }
    }
    
    componentWillMount(){
        Components.customHeaders = this;
    }
    
    addField(){
        const headers = this.state.headers;
        
        headers.push({});
        
        this.setState({
            headers:headers
        });
    }
    
    setValue(key,name,value){
        const headers = this.state.headers,
              target = headers[key] ? headers[key] : null,
              outputData = {};
        
        if(!target){
            return ;
        }
        
        target[name] = value;
        
        this.setState({
            headers:headers
        });
        
        //set post headers value to the sendRequest Component
        headers.forEach( (item) => {
            if(!item.name){
                return ;
            }
            
            outputData[item.name] = item.value || '';
        } );
        
        Components.sendRequest.setData('headers',outputData);
    }
    
    render(){
        
        const items = this.state.headers.map( (item,key) => (
            <View style={styles.lineItemContentMainLine} key={key}>
                <TextInput underlineColorAndroid={'transparent'} placeholderTextColor={'rgba(47,47,47,.6)'} style={styles.lineItemContentMainField} placeholder="name" onChangeText={ (text) => { this.setValue(key,'name',text) } } />
                <TextInput underlineColorAndroid={'transparent'} placeholderTextColor={'rgba(47,47,47,.6)'} style={styles.lineItemContentMainValue} placeholder="value" onChangeText={ (text) => { this.setValue(key,'value',text) } } />
            </View>
        ) );
        
        return (
            <View style={styles.lineItem}>
                <Text style={styles.switcherItemTitle}>Custom Headers</Text>
                <View style={styles.lineItemContent}>
                    <View style={styles.lineItemContentAdd}>
                        <TouchableOpacity onPress={ e => { this.addField(e) } } activeOpacity={.7} style={styles.lineItemContentAddButton}>
                            <Text style={[styles.icon,styles.lineItemContentAddIcon]}></Text>
                            <Text style={[styles.displayFontMiddle,styles.lineItemContentAddText]}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.lineItemContentMain}>
                        { items }
                    </View>
                    <View style={styles.lineItemContentButton}>
                        <TouchableOpacity onPress={ e => { this.addField(e) } } activeOpacity={.7} style={styles.lineItemContentButtonTouch}>
                            <Text style={[styles.displayFontMiddle,styles.lineItemContentButtonTouchText]}>Add Fields</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

class RequestData extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            data:[
                {}
            ]
        }
    }
    
    componentWillMount(){
        Components.requestData = this;
    }
    
    addField(){
        const data = this.state.data;
        
        data.push({});
        
        this.setState({
            data:data
        });
    }
    
    setValue(key,name,value){
        const data = this.state.data,
              target = data[key] ? data[key] : null,
              outputData = {};
        
        if(!target){
            return ;
        }
        
        target[name] = value;
        
        this.setState({
            data:data
        });
        
        //set post post body / raw data to the sendRequest Component
        data.forEach( (item) => {
            if(!item.name){
                return ;
            }
            
            outputData[item.name] = item.value || '';
        } );
        
        Components.sendRequest.setData('data',outputData);
    }
    
    setRandomOption(key,bool){
        const data = this.state.data,
              target = data[key] ? data[key] : null;
        
        if(!target.name){
            return ;
        }
        
        bool ? ( randomFields.indexOf(target.name) < 0 && randomFields.push(target.name) ) : randomFields.remove(target.name);
    }
    
    render(){
        
        const items = this.state.data.map( (item,key) => (
            <View style={styles.lineItemContentMainLine} key={key}>
                <TextInput underlineColorAndroid={'transparent'} placeholderTextColor={'rgba(47,47,47,.6)'} style={styles.lineItemContentMainField} value={ item.name } placeholder="name" onChangeText={ (text) => { this.setValue(key,'name',text) } } />
                <TextInput underlineColorAndroid={'transparent'} placeholderTextColor={'rgba(47,47,47,.6)'} style={styles.lineItemContentMainValue} value={ item.value } placeholder="value" onChangeText={ (text) => { this.setValue(key,'value',text) } } />
                <View style={styles.lineItemContentMainLineRandom}>
                    <CheckBox onChange={ str => { this.setValue(key,'value', (str ? randomStr() : '') ); this.setRandomOption(key, (str ? true : false) ) } } />
                    <Text style={[styles.displayFontMiddle,styles.lineItemContentMainLineRandomCheckText]}>Random</Text>
                </View>
            </View>
        ) );
        
        return (
            <View style={styles.lineItem}>
                <Text style={styles.switcherItemTitle}>Request Body / Raw Data</Text>
                <View style={styles.lineItemContent}>
                    <View style={styles.lineItemContentAdd}>
                        <TouchableOpacity onPress={ e => { this.addField(e) } } activeOpacity={.7} style={styles.lineItemContentAddButton}>
                            <Text style={[styles.icon,styles.lineItemContentAddIcon]}></Text>
                            <Text style={[styles.displayFontMiddle,styles.lineItemContentAddText]}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.lineItemContentMain}>
                        { items }
                    </View>
                    <View style={styles.lineItemContentButton}>
                        <TouchableOpacity onPress={ e => { this.addField(e) } } activeOpacity={.7} style={styles.lineItemContentButtonTouch}>
                            <Text style={[styles.displayFontMiddle,styles.lineItemContentButtonTouchText]}>Add Fields</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

class RequestOption extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            concurrency:'200',
            timeout:'6000',
            proxy:''
        }
    }
    
    componentWillMount(){
        Components.requestOption = this;
    }
    
    setNumber(key,value){
        const obj = {};
        
        if(isNaN(value)){
            return ;
        }
        
        obj[key] = value.toString();
        
        this.setState(obj);
        
        //sync options to sendRequest component
        setTimeout( () => {
            
            const options = this.state;
            
            if(options.timeout){
                Components.sendRequest.setData('timeout',( options.timeout * 1));
            }
            
            if(options.concurrency){
                Components.sendRequest.setState({
                    concurrency:options.concurrency
                });
            }
            
        },20 );
    }
    
    setString(text){
        this.setState({
            proxy:text
        });
        
        //sync proxy to sendRequest component
        setTimeout( () => {
            
            const options = this.state;
            
            if(options.proxy){
                const proxy = options.proxy.replace(/(http\:\/\/)|(https\:\/\/)/,''),
                      obj = {};
                
                const arr = proxy.split(':');
                
                obj['host'] = arr[0];
                obj['port'] = arr[1];
                
                Components.sendRequest.setData('proxy',obj);
            }
            
        },20 );
    }
    
    render(){
        
        return (
            <View style={styles.requestOption}>
                <View style={styles.requestOptionItem}>
                    <Text style={[styles.requestOptionItemTitle]}>Concurrency</Text>
                    <TextInput underlineColorAndroid={'transparent'} placeholderTextColor={'rgba(47,47,47,.6)'} style={styles.requestOptionItemInput} value={ this.state.concurrency } onChangeText={ (text) => { this.setNumber('concurrency',text) } } />
                </View>
                <View style={styles.requestOptionItem}>
                    <Text style={[styles.requestOptionItemTitle]}>Timeout(ms)</Text>
                    <TextInput underlineColorAndroid={'transparent'} placeholderTextColor={'rgba(47,47,47,.6)'} style={styles.requestOptionItemInput} value={ this.state.timeout.toString() } onChangeText={ (text) => { this.setNumber('timeout',text) } } />
                </View>
                <View style={[styles.requestOptionItem,{width:6 * rem}]}>
                    <Text style={[styles.requestOptionItemTitle]}>Proxy</Text>
                    <TextInput underlineColorAndroid={'transparent'} placeholderTextColor={'rgba(47,47,47,.6)'} style={[styles.requestOptionItemInput,{width:6.5 * rem}]} placeholder={'ProxyIP Address'} value={ this.state.proxy } onChangeText={ (text) => { this.setString(text) } } />
                </View>
            </View>
        );
    }
}

class SendRequest extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            postData:{
                url:'',
                method:'GET',
                timeout:6000,
                headers:{},
                data:{}
            },
            concurrency:200
        }
    }
    
    componentWillMount(){
        Components.sendRequest = this;
    }
    
    setData(key,value){
        const postData = this.state.postData;
        
        postData[key] = value;   
        
        this.setState({
            postData:postData
        });
    }
    
    setPostType(type){
        /*
        const postData = this.state.postData;
        
        if(!type){
            return delete postData.headers['Content-Type'];
        }
        
        postData.headers['Content-Type'] = type
        
        this.setState({
            postData:postData
        });
        */
        
        axios.defaults.headers.post['Content-Type'] = type;
    }
    
    onReset(){
        //reset default value
        
        taskPaused = true;
        
        Components.requestUrl.setState({
            url:''
        });
        
        Components.switchRequestType.setState({
            value:false,
            method:'GET'
        });
        
        Components.switchPostBodyType.setState({
            value:false,
            isDisplay:false,
            type:'application/x-www-form-urlencoded'
        });
        
        Components.customHeaders.setState({
            headers:[{}]
        });
        
        Components.requestData.setState({
            data:[{}]
        });
        
        Components.requestOption.setState({
            concurrency:'200',
            timeout:'6000',
            proxy:''
        });
    }
    
    onSubmit(){
        const postData = Object.assign({},this.state.postData),
              requestArr = new Float32Array( 5000000 ),
              concurrency = this.state.concurrency || 200;
        
        //confirm request data
        if(!postData.url){
            return dialog('request url can not be "null"');
        }
        
        postData.url = postData.url.toLocaleLowerCase();
        postData.url = postData.url.indexOf('http') < 0 ? ('http://' + postData.url) : postData.url;
        
        if(postData.method == 'GET'){
            delete postData.data;
        }
        
        //check random variable
        if(postData.data){
            for(var key in postData.data){
                var isRandom = randomFields.indexOf(key) > -1 ? true : false;
                isRandom && (postData.data[key] = randomStr());
            }
        }
        
        Components.terminal.open();
        
        taskPaused = false;
        async.eachLimit(requestArr,concurrency,(item,callback) => {
            
            if(taskPaused){
                return setTimeout(callback,50);
            }
            
            axios(postData).then( (response) => {
                if(response.data){
                    Components.terminal.push( response.data );
                    callback();
                }
            } ).catch(function (error) {
                Components.terminal.push( 'Connection error' );
                callback();
            });
            
        },() => {
            //request finished
            Components.terminal.push('request finished');
        });
    }
    
    render(){
        return (
            <View style={ styles.sendRequest }>
                <TouchableOpacity onPress={ e => { this.onReset() } } activeOpacity={.7} style={[styles.lineItemContentButtonTouch,styles.sendRequestButton,styles.sendRequestButtonReset]}>
                    <Text style={[styles.displayFontMiddle,styles.lineItemContentButtonTouchText]}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={ e => { this.onSubmit() } } activeOpacity={.7} style={[styles.lineItemContentButtonTouch,styles.sendRequestButton]}>
                    <Text style={[styles.displayFontMiddle,styles.lineItemContentButtonTouchText]}>Do It</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

class Terminal extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            data:['Responese data'],
            anm:new Animated.Value(.8)
        }
    }
    
    componentWillMount(){
        Components.terminal = this;
        
        //bind touch event
        var sY = 0,
            eY = 0,
            touchEvents = {
            onStartShouldSetPanResponder: (evt) => true,
            onMoveShouldSetPanResponder: (evt) => true,
            onPanResponderGrant: (evt,gestureState) => {
                sY = gestureState.y0;
                eY = 0;
            },
            onPanResponderMove: (evt,gestureState) => {
                eY = ( gestureState.moveY - sY );
            },
            onPanResponderRelease: (evt,gestureState) => {
                if( eY < -(7.5 * rem * .3) ){
                    Components.terminal.open();
                }else if( eY > (7.5 * rem * .5) ){
                    Components.terminal.close();
                }
            }
        };
        
        this.panResponder = PanResponder.create(touchEvents);
    }
    
    push(value){
        const data = this.state.data.length > 200 ? [] : this.state.data,
            self = this;
        
        data.push( value );
        
        this.setState({
            data:data
        });
    }
    
    clear(){
        this.setState({
            data:['Responese data']
        });
    }
    
    open(){
        Animated.timing(this.state.anm,{
            toValue:0,
            duration:300,
            easing:Easing.bezier(0.075, 0.82, 0.165, 1),
            useNativeDriver:true
        }).start( () => {
            
        } );
    }
    
    close(){
        Animated.timing(this.state.anm,{
            toValue:.8,
            duration:300,
            easing:Easing.bezier(0.075, 0.82, 0.165, 1),
            useNativeDriver:true
        }).start( () => {
            
        } );
    }
    
    render(){
        
        if( !this.state.data || (this.state.data && !this.state.data.length) ){
            return (<View></View>);
        }
        
        const terminal = this.state.data.map( (item,key) => (
            <Text key={key} style={[styles.displayFontMiddle,styles.terminalFont]}>{ typeof(item)=='object' ? JSON.stringify(item) : item.toString() }</Text>
        ) );
        
        return (
            <Animated.View style={[
                styles.terminal,
                {
                    transform:[{translateY:this.state.anm.interpolate({inputRange:[0, 1],outputRange:[0,7.5 * rem]})}],
                }
            ]} {...this.panResponder.panHandlers}>
                <ScrollView ref={(scrollView) => { _scrollView = scrollView; }} onContentSizeChange={ e => { _scrollView.scrollToEnd({animated:false}) } } style={styles.terminalContainer}>
                    { terminal }
                </ScrollView>
                <TouchableOpacity onPress={ e => { this.clear() } } activeOpacity={.7} style={styles.terminalClear}>
                    <Text style={[styles.icon,styles.terminalClearIcon]}></Text>
                    <Text style={[styles.displayFontMiddle,styles.terminalClearText]}>Clear</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

//common styles
const styles = StyleSheet.create({
    container:{
        width:16 * rem,
        top:0,
        left:0,
        bottom:0,
        position:'absolute',
        backgroundColor:'#f1f1f1',
        overflow:'hidden'
    },
    main:{
        width:(16-.75*2) * rem,
        top:1.125 * rem,
        left:.75*rem,
        height:height - (2 * rem),
        position:'relative'
    },
    mbl:{
        marginBottom:.25 * rem
    },
    headers:{
        height:2.25 * rem,
        marginBottom:.5 * rem
    },
    mainContainer:{
        position:'absolute',
        left:0,
        top:2.75 * rem,
        width:14.5 * rem,
        bottom:2 * rem
    },
    headersSlogan:{
        height:.75*rem,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        marginBottom:.5 * rem
    },
    icon:{
        fontFamily:iconName,
        marginTop:(platform=='ios') ? -.15 * rem : 0
    },
    displayFontMiddle:{
        fontSize:.375 * rem,
        color:'rgba(47,47,47,.4)',
        fontFamily:fontName
    },
    headersIcon:{
        fontSize:.75 * rem,
        color:'#2f2f2f',
        marginRight:.25 * rem
    },
    headersIconText:{
        color:'#2f2f2f',
        fontSize:.625 * rem,
        fontFamily:fontName
    },
    headersSloganText:{
        fontSize:.4 * rem,
        color:'rgba(47,47,47,.4)',
        fontFamily:fontName
    },
    switcher:{
        flexDirection:'row',
        alignItems:'center',
        height:1 * rem,
        marginBottom:1.5 * rem
    },
    swtichBtn:{
        marginRight:.25 * rem
    },
    switcherItem:{
        width:5 * rem,
        height:1 * rem,
        marginRight:1.25 * rem,
    },
    switcherItemTitle:{
        fontSize:.45 * rem,
        color:'rgba(47,47,47,.8)',
        fontFamily:fontName,
        marginBottom:.15 * rem
    },
    switcherItemContent:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start'
    },
    lineItem:{
        marginBottom:1 * rem
    },
    lineItemContentAddButton:{
        width:1.25 * rem,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    lineItemContentAdd:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end',
        marginBottom:.25 * rem
    },
    lineItemContentAddIcon:{
        fontSize:.375 * rem,
        color:'rgba(47,47,47,1)',
    },
    lineItemContentAddText:{
        color:'rgba(47,47,47,1)',
    },
    lineItemContentMainLine:{
        marginBottom:.25 * rem,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        position:'relative'
    },
    lineItemContentMainFull:{
        width:14.5 * rem,
        height:1.5 * rem,
        backgroundColor:'rgba(202,202,202,.2)',
        fontSize:.45 * rem,
        color:'rgba(47,47,47,.6)',
        fontFamily:fontName,
        paddingLeft:.5 * rem,
        paddingRight:.5 * rem,
    },
    lineItemContentMainField:{
        width:3.25 * rem,
        height:1.5 * rem,
        marginRight:.25 * rem,
        backgroundColor:'rgba(202,202,202,.2)',
        fontSize:.45 * rem,
        color:'rgba(47,47,47,.6)',
        fontFamily:fontName,
        paddingLeft:.5 * rem,
        paddingRight:.5 * rem,
    },
    lineItemContentMainValue:{
        width:11 * rem,
        height:1.5 * rem,
        marginRight:.5 * rem,
        backgroundColor:'rgba(202,202,202,.2)',
        fontSize:.45 * rem,
        color:'rgba(47,47,47,.6)',
        fontFamily:fontName,
        paddingLeft:.5 * rem,
        paddingRight:.5 * rem,
    },
    lineItemContentButton:{
        height:1 * rem,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end'
    },
    lineItemContentButtonTouch:{
        width:3 * rem,
        height:1 * rem,
        backgroundColor:'rgba(47,47,47,1)',
        alignItems:'center',
        justifyContent:'center'
    },
    lineItemContentButtonTouchText:{
        color:'#fff',
        fontSize:.4 * rem
    },
    requestOption:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        marginBottom:1 * rem
    },
    requestOptionItem:{
        width:3.25 * rem,
        marginRight:.75 * rem
    },
    requestOptionItemTitle:{
        fontSize:.45 * rem,
        color:'rgba(47,47,47,.8)',
        fontFamily:fontName,
        marginBottom:.5 * rem
    },
    requestOptionItemInput:{
        width:3 * rem,
        height:1.5 * rem,
        backgroundColor:'rgba(202,202,202,.2)',
        fontSize:.45 * rem,
        color:'rgba(47,47,47,.6)',
        fontFamily:fontName,
        paddingLeft:.5 * rem,
        paddingRight:.5 * rem,
    },
    lineItemContentMainLineRandom:{
        position:'absolute',
        top:0,
        right:.5 * rem,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        width:2.75 * rem
    },
    lineItemContentMainLineRandomCheck:{
        width:1.5 * rem,
        height:1.5 * rem,
        alignItems:'center',
        justifyContent:'center',
    },
    lineItemContentMainLineRandomCheckIcon:{
        color:'rgba(47,47,47,.6)',
        fontSize:.55 * rem
    },
    lineItemContentMainLineRandomCheckText:{
        color:'rgba(47,47,47,.6)',
        marginLeft:-.25 * rem
    },
    sendRequest:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end',
    },
    sendRequestButton:{
        height:1.5 * rem,
        marginLeft:.5 * rem
    },
    sendRequestButtonReset:{
        backgroundColor:'rgba(47,47,47,.4)'
    },
    terminal:{
        position:'absolute',
        left:0,
        bottom:0,
        width:16 * rem,
        height:7.5 * rem,
        backgroundColor:'#2f2f2f'
    },
    terminalContainer:{
        width:15 * rem,
        height:6.5 * rem,
        left:.5 * rem,
        top:.5 * rem,
        overflow:'hidden'
    },
    terminalFont:{
        fontSize:.5 * rem,
        color:'rgb(241,241,241)',
        height:1.5 * rem,
        overflow:'hidden'
    },
    terminalClear:{
        height:.75 * rem,
        width:2.5 * rem,
        position:'absolute',
        right:.5 * rem,
        bottom:.5 * rem,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    terminalClearIcon:{
        fontSize:.5 * rem,
        color:'rgb(241,241,241)',
        marginRight:.15 * rem
    },
    terminalClearText:{
        fontSize:.5 * rem,
        color:'rgb(241,241,241)'
    }
});
