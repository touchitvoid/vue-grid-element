
var pick=require('lodash/pick')

const isNotIn=(obj,v,key)=>v&&(obj[key]=v)

import pluginHelper from './Grid.column.plugin.js'


export default {
    name:'GridColumn',
    render(h){
        var me=this;
        function renderChild(column){

            var ps={attrs:{}};
            var {header,dataIndex,width,formatter,children,type,pk,slot}=pluginHelper(column,h);
            ps.attrs.key=dataIndex||(pk+type);
            isNotIn(ps.attrs,header,'label')
            isNotIn(ps.attrs,dataIndex,'prop')
            isNotIn(ps.attrs,width,'width')
            isNotIn(ps.attrs,formatter,'formatter')

            if(slot){
                //搞定
                ps.scopedSlots={default:({row})=>slot({row,column})}
            }
            
            if(column.children){
                ps.attrs.headerAlign="center";
                return <el-table-column {...ps}>
                    {
                        column.children.map((child,index)=>{
                            return renderChild(child)
                        })
                    }
                </el-table-column>
            }
            else{
                return <el-table-column 
                {...ps}>
                </el-table-column>
            }
        }

        if(this.column)    
            return renderChild(this.column);
    },
    props:{
        column:null,
        pk:{
            type:String,
        }
    },
}