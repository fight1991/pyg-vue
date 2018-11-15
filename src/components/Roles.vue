<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="navBread">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" @click="showRoleDialog">添加角色</el-button>
    <el-table
    :data="rolesList"
    style="width: 100%">
      <el-table-column
        type="expand">
        <template slot-scope="scope">
          <el-row v-for="levelOne in scope.row.children" :key="levelOne.id" class="levelOne">
            <!-- 一级权限 -->
            <el-col :span="4">
              <el-tag closable  @close="handleClose(levelOne.id,scope.row)">{{levelOne.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="levelTwo in levelOne.children" :key="levelTwo.id">
                <!-- 二级权限 -->
                <el-col :span="4">
                  <el-tag closable type="success" @close="handleClose(levelTwo.id,scope.row)">{{levelTwo.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <!-- 三级权限 -->
                  <el-tag closable type="danger" v-for="levelThree in levelTwo.children" :key="levelThree.id" @close="handleClose(levelThree.id,scope.row)">
                    {{levelThree.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        :index="0">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="描述"
        width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" icon="el-icon-edit"  size="small" plain @click="showEditRoles(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="small"  plain @click="delRoles(scope.row.id)"></el-button>
            <el-button type="success" icon="el-icon-check" size="small" @click="showAssignRights(scope.row)"  plain>分配权限</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限的dialog框 -->
    <el-dialog title="收货地址" :visible.sync="dialogRightVisible">
      <el-tree
        :data="rightsList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRightVisible=false">取 消</el-button>
        <el-button type="primary" @click="addRights">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色的dialog框 -->
    <el-dialog title="添加角色" :visible.sync="dialogRoleVisible">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="80px" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" >
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色的dialog框 -->
    <el-dialog title="编辑角色" :visible.sync="dialogEditVisible">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" >
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      rightsList: [],
      dialogRightVisible: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      dialogRoleVisible: false,
      dialogEditVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRolesList()
    this.getRightsList()
  },
  methods: {
    // 得到所有的权限列表
    async getRightsList() {
      let res = await this.axios.get('rights/tree')
      // console.log(res)
      this.rightsList = res.data
    },
    // 得到角色列表
    async getRolesList() {
      let res = await this.axios.get('roles')
      // console.log(res)
      this.rolesList = res.data
    },
    // 删除角色
    async delRoles(id) {
      try {
        await this.$confirm('确定要删除角色吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        console.log(id)
        let { meta: { status } } = await this.axios.delete(`roles/${id}`)
        if (status === 200) {
          this.getRolesList()
          this.$message.success('删除成功')
        }
      } catch (e) {
        console.log('取消删除')
      }
    },
    // 点击分配权限按钮,显示表单树
    showAssignRights(info) {
      // 显示dialog框
      this.dialogRightVisible = true
      // 存取角色id
      this.roleId = info.id
      // 找到所有三级权限的id
      let keys = []
      info.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            keys.push(item3.id)
          })
        })
      })
      // 通过key设置设置选中的节点
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(keys)
      })
    },
    // 点击确定按钮,增加权限
    async addRights() {
      // 先获取到所有全选中id值
      let checked = this.$refs.tree.getCheckedKeys()
      // 获取到所有半选中的id
      let halfChecked = this.$refs.tree.getHalfCheckedKeys()
      let all = [...checked, ...halfChecked]
      all = all.toString()
      let { meta: { status } } = await this.axios.post(
        `roles/${this.roleId}/rights`,
        {
          rids: all
        }
      )
      if (status === 200) {
        this.dialogRightVisible = false
        // 重新渲染列表
        this.getRolesList()
        this.$message.success('更新权限成功')
      } else {
        this.$message.error('更新失败')
      }
    },
    // 删除权限
    async handleClose(rightId, role) {
      let { data, meta: { status } } = await this.axios.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (status === 200) {
        console.log(data)
        role.children = data
      }
    },
    // 点击添加用户按钮 dialog框显示
    showRoleDialog() {
      this.dialogRoleVisible = true
    },
    addRole() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        // 发送axios请求
        let { meta: { status } } = await this.axios.post('roles', this.addForm)
        if (status === 201) {
          // 隐藏对话框
          this.dialogRoleVisible = false
          // 重新渲染角色列表
          this.getRolesList()
          this.$message.success('添加角色成功')
        }
      })
    },
    // 点击编辑按钮,显示dialog对话框
    showEditRoles({ id, roleName, roleDesc }) {
      this.dialogEditVisible = true
      // 数据回显
      this.editForm.roleName = roleName
      this.editForm.roleDesc = roleDesc
      // 存储roleID
      this.editForm.roleId = id
    },
    // 编辑提交
    editRole() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false
        // 发送 ajax请求
        let res = await this.axios({
          method: 'put',
          url: `roles/${this.editForm.roleId}`,
          data: this.editForm
        })
        if (res.meta.status === 200) {
          // 跟新列表
          this.getRolesList()
          // 隐藏dialog框
          this.dialogEditVisible = false
          this.$message.success('修改成功')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.navBread {
  height: 40px;
}
.levelOne {
  border-bottom: 1px dotted #ccc;
  .el-tag {
    margin: 5px 5px;
  }
}
</style>
