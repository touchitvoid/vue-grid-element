/** 对column 的补充 
* date 04-20
* author wolfsky7 -->------|----------------->
**/
import { renderUtil } from '~/util'
import Vue from 'vue'

const typeFormaters = {
    'time': 'renderTime',
    'money': 'renderMoney',
    'number': 'renderNumber',
    'phone': 'renderPhone',
    'ymd': 'renderYmd',
    'enum': 'renderEnum',
    'districtCode': 'renderDistrictCode',
    'status': 'renderStatus',
    'gender': renderUtil.renderEnum2.bind(null, 'gender'),
    'gateway': renderUtil.renderEnum2.bind(null, 'gateway'),
}

const typeRenders = {
    'switch': h => ({ row, column, $index }) => {
        const property = column.property;
        let value = property && getValueByPath(row, property);
        if (column && column.formatter) {
            value = column.formatter(row, column, value, $index);
        }
        return <el-switch value={value}></el-switch>
    },
    'btns': h => ({ row, column, $index }) => <div class="nowrap">
        {
            column.btns.map(btn => {
                let t = btn.text;
                if (btn.formatter) {
                    t = btn.formatter(row, column, t, $index)
                }
                return <el-button size="mini" type={btn.type || 'primary'} on-click={btnHandler(btn, row)}>{t}</el-button>
            })
        }
    </div>
}

const btnHandler = (btn, row) => () => {
    btn.handler(row);
}

export default (column, h) => {
    //对column 进行补充
    column = types(column, h)

    column = customsTypes(column, h);

    column = customs(column, h);

    return column;
}

const types = (column, h) => {
    // formatter 没有在模板里面绑定 需要给定函数
    //类型补充
    if (!column.formatter && 'type' in column && typeFormaters[column.type]) {
        let formatter, format = typeFormaters[column.type];
        if (typeof format == "function") {
            formatter = format;
        }
        else {
            formatter = Vue.prototype[column.formatter] || renderUtil.bindTableFormatter2Render(format);
        }
        return {
            ...column,
            formatter
        }
    }

    if (column.formatter && typeof column.formatter == "string") {
        let formatter = Vue.prototype[column.formatter] || renderUtil.bindTableFormatter2Render[column.formatter];
        return {
            ...column,
            formatter
        }
    }

    return column;
}

const customsTypes = (column, h) => {
    if (!column.render && typeRenders[column.type]) {
        column.render = typeRenders[column.type]
    }
    return column;
}


const customs = (column, h) => {
    if ('render' in column) {
        var slot = column.render(h);
        var { render, ...left } = column
        return {
            ...left,
            slot
        }
    }
    return column;
}

const getValueByPath = function (object, prop) {
    prop = prop || '';
    const paths = prop.split('.');
    let current = object;
    let result = null;
    for (let i = 0, j = paths.length; i < j; i++) {
        const path = paths[i];
        if (!current) break;

        if (i === j - 1) {
            result = current[path];
            break;
        }
        current = current[path];
    }
    return result;
};