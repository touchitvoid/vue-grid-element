<template>
  <div>
    <el-table ref="table" :data="rows" stripe border :show-header="showHeader" style="width:100%">
      <template v-for="(column,key,index) in columns">
        <GridColumn :column="column" :key="key" :pk="index" v-bind=$attrs></GridColumn>
      </template>
    </el-table>
    <div class="text-right m-t" v-if="showFooter">
      <Pagination :options="this" @list="list"></Pagination>
    </div>
  </div>
</template>

<script>
import api from "~/api";
import { baseUtil, renderUtil } from "~/util";
import GridColumn from "./Grid.column.js";

export default {
  props: {
    inData: null,
    dataField: null,
    beforeDataRender: null,
    columns: {
      type: Array, //{header,dataIndex,type}
      required: true
    },
    url: null,
    getQuery: {
      type: Function
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    }
  },
  components: {
    GridColumn
  },
  created() {
    if (this.inData) {
      this.rows = this.inData;
    }
  },

  data() {
    return {
      rows: [],
      params: {},
      total: 0
    };
  },

  watch: {
    //watch props 变化
    inData: function(value) {
      if (value) this.rows = value;
    },
    url: function(value) {
      //url 变化 重取数据
      this.list();
    }
  },

  mounted() {
    if (this.url) this.list();

    // 事件绑定
    if (this.$listeners) {
      Object.keys(this.$listeners).forEach(key => {
        this.$refs.table.$on(key, this.$listeners[key]);
      });
    }
  },
  beforeDestory() {
    // 事件绑定
    if (this.$listeners) {
      Object.keys(this.$listeners).forEach(key => {
        this.$refs.table.$off(key, this.$listeners[key]);
      });
    }
  },
  methods: {
    list() {
      api.request({
        url: this.url,
        params: this.getQueryData(),
        success: json => {
          if (this.beforeDataRender) {
            json = this.beforeDataRender(json);
          }
          this.rows = json.data.list;
          this.total = json.data.total;
        }
      });
    },

    getQueryData() {
      var outQuery = this.params;
      if (this.getQuery) {
        outQuery = Object.assign({}, this.params, this.getQuery());
      }
      return outQuery;
    },

    update(predicate, setV) {
      this.rows.forEach(item => {
        if (predicate(item)) {
          setV(item);
        }
      });
    },
    del(predicate) {
      let indexs = [];
      this.rows.forEach((item, index) => {
        if (predicate(item)) {
          indexs.push(index);
        }
      });

      indexs.reverse().forEach(ind => {
        this.rows.splice(ind, 1);
      });

      // this.rows = [...this.rows];
    }
  }
};
</script>