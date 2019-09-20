<template>
  <div class="dialog">
    <el-dialog
      title="添加资资金信息"
      :visible.sync="dialog.show"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
    >
      <div class="form">
        <el-form
          ref="form"
          :rules="form_rules"
          :model="formData"
          label-position="right"
          label-width="120px"
          style="margin:10px;"
        >
          <el-form-item label="收支类型">
            <el-select v-model="formData.type" placeholder="请选择收支类型">
              <el-option v-for="(type,index) in typeList" :key="index" :label="type" :value="type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收支描述：" prop="describe">
            <el-input type="describe" v-model="formData.describe"></el-input>
          </el-form-item>
          <el-form-item prop="income" label="收入:">
            <el-input type="income" v-model="formData.income"></el-input>
          </el-form-item>
          <el-form-item prop="expend" label="支出:">
            <el-input type="expend" v-model="formData.expend"></el-input>
          </el-form-item>
          <el-form-item prop="cash" label="账户现金:">
            <el-input type="cash" v-model="formData.cash"></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input type="textarea" v-model="formData.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "dialog",
  props: {
    dialog: Object
  },
  data() {
    return {
      formData: {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      },
      typeList: ["提现", "提现手续费", "充值", "优惠券", "充值礼券", "转账"],
      form_rules: {
        describe: [
          { required: true, message: "收支描述不能为空！", trigger: "blur" }
        ],
        income: [
          { required: true, message: "收入不能为空！", trigger: "blur" }
        ],
        expend: [
          { required: true, message: "支出不能为空！", trigger: "blur" }
        ],
        cash: [{ required: true, message: "账户不能为空！", trigger: "blur" }]
      }
    };
  },
  methods: {
      onSubmit(form){
          this.$refs[form].validate(valid => {
              if(valid){
                  this.$axios.post('/api/profiles/add',this.formData)
                    .then(res => {
                        // 提示添加成功
                        this.$message({
                            message: "数据添加成功",
                            type: "success"
                        })
                        // 影藏对话框
                        this.dialog.show =false;
                        // 触发事件重新获取数据
                        this.$emit("update");
                    })
                    .catch(err => {
                        this.$message({
                            message: err,
                            type: "error"
                        })
                    })
              }
          })
      }
  },
};
</script>
<style scoped>
</style>