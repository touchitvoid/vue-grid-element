/** 对column 的补充 
* date 04-20
* author wolfsky7 -->------|----------------->
**/
import {renderUtil} from '~/util'


//各种formater 定义
// Vue.prototype.renderYmd = renderUtil.renderYmd;
// Vue.prototype.renderTime = renderUtil.renderTime;
// Vue.prototype.renderNumber = renderUtil.renderNumber;
// Vue.prototype.renderMoney = renderUtil.renderMoney;
// Vue.prototype.renderEnum = renderUtil.renderEnum;
// Vue.prototype.renderPhone = renderUtil.renderPhone;
// Vue.prototype.renderEnabled = renderUtil.renderEnabled;
// Vue.prototype.renderDistrictCode = renderUtil.renderDistrictCode;

const typeFormaters={
    'time':'renderTime',
    'money':'renderMoney',
    'number':'renderNumber',
    'phone':'renderPhone',
    'ymd':'renderYmd',
    'enum':'renderEnum',
    'districtCode':'renderDistrictCode',
    'status':'renderStatus',
    'gender':renderUtil.renderEnum2.bind(null,'gender'),
    'gateway':renderUtil.renderEnum2.bind(null,'gateway'),
}

const typeRenders={
    'switch':h=>({row,column})=><el-switch value={row[column.dataIndex]}></el-switch>,
    'btns':h=>({row,column})=><div class="nowrap">
        {
            column.btns.map(btn=>{
                return <el-button  size="mini" type={btn.type||'primary'} on-click={btnHandler(btn,row)}>{btn.text}</el-button>
            })
        }
        </div>
}

const btnHandler=(btn,row)=>()=>{
    btn.handler(row);
}

export default (column,h)=>{
    //对column 进行补充
    column=types(column,h)

    column=customsTypes(column,h);

    column=customs(column,h);

    return column;
}

const types=(column,h)=>{
    //类型补充
    if(!column.formatter&&'type' in column&&typeFormaters[column.type]){
        let formatter,format=typeFormaters[column.type];
        if(typeof format=="function"){
            formatter=format;
        }
        else{
            formatter=renderUtil[format];
        }
        return {
            ...column,
            formatter
        }
    }

    return column;
}

const customsTypes=(column,h)=>{
    if(!column.render&&column.type in typeRenders){
        column.render=typeRenders[column.type]
    }
    return column;
}


const customs=(column,h)=>{
    if('render' in column){
        var slot=column.render(h);
        var {render,...left}=column
        return {
            ...left,
            slot
        }
    }
    return column;
}