<script setup lang="ts">
import type { PropType } from 'vue';
import { TableItemType } from '@/types/table';
const props = defineProps({
  tableHeader: {
    type: Array as PropType<TableItemType[]>,
    default: () => [],
  },
  tableData: {
    type: Array,
    default: () => [],
  },
  listLoading: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Boolean,
    default: true,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  total: {
    type: Number,
    default: 100,
  },
});
const emit = defineEmits(['handelSelect', 'handlePagination']);
// 选择
const handleSelectionChange = (val: []) => {
  emit('handelSelect', val);
};
// 改变分页
const handleSizeChange = (val: number) => {
  emit('handlePagination', { pageSize: val, currentPage: props.currentPage });
};
const handleCurrentChange = (val: number) => {
  emit('handlePagination', {
    pageSize: props.pageSize,
    currentPage: val,
  });
};
</script>

<template>
  <el-table
    :data="tableData"
    :header-cell-style="{
      background: '#f5f6fa',
      color: '#555',
      fontWeight: 'normal',
      fontSize: '12px',
    }"
    :cell-style="{ fontSize: '12px' }"
    @selection-change="handleSelectionChange"
  >
    <!-- 复选框 -->
    <el-table-column type="selection" width="55" />
    <!-- 数据 -->
    <template v-for="(item, index) in tableHeader" :key="index">
      <!-- 编辑按钮 -->
      <el-table-column
        v-if="item.actions"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        fixed="right"
      >
        <template #default="scope">
          <!-- 操作按钮 -->
          <div>
            <el-button
              text
              size="small"
              v-for="(action, index) in item.actions"
              :key="index"
              :type="action.type"
              @click="action.func(scope.row)"
              >{{ action.name }}</el-button
            >
          </div>
        </template>
      </el-table-column>
      <!-- 图片展示 -->
      <el-table-column
        v-else-if="item.image"
        :label="item.label"
        :width="item.width"
      >
        <template #default="{ row }">
          <div v-if="row[item.prop]">
            <el-image
              preview-teleported
              :hide-on-click-modal="true"
              :preview-src-list="[row[item.prop!]]"
              :src="row[item.prop!]"
              fit="cover"
              style="width: 40px; height: 40px; border-radius: 8px"
            />
          </div>
          <div v-else>暂无图片</div>
        </template>
      </el-table-column>
      <!--  formatter信息展示-->
      <el-table-column
        v-else-if="item.formatter"
        :label="item.label"
        :width="item.width"
        :align="item.aligen || 'center'"
      >
        <template #default="{ row }">
          <el-tag :type="item.getType!(row)"> {{ item.formatter(row) }}</el-tag>
        </template></el-table-column
      >
      <!--普通信息展示  -->
      <el-table-column
        v-else
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        :align="item.aligen || 'center'"
      ></el-table-column>
    </template>
  </el-table>
  <div v-if="pagination" class="float-right">
    <el-pagination
      background
      :small="true"
      layout="sizes,prev, pager, next"
      :total="total"
      :currentPage="currentPage"
      :page-size="pageSize"
      :page-sizes="[10, 20, 30, 50]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style></style>
