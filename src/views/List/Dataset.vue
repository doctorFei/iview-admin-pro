<template>
  <div class="content-container" style="padding: 20px 20px 60px;">
    <div class="title" style="margin-bottom: 20px">
      <Input v-model="dataFilter" placeholder="请输入搜索内容" style="width: 300px"></Input>
      <Button type="primary">查找</Button>
      <Button>重置</Button>
    </div>
    <div class="content">
      <Button type="dashed" class="add">添加</Button>
      <ul class="data-list-wrap">
        <li class="data-list">
          <div class="file-icon">
            <i class="icon-cnt"></i>
          </div>
          <div class="file-desc">
            <h3 class="file-desc-title">自然语言处理</h3>
            <p class="file-desc-content">主题描述：显示关于此数据集的主题相关的描述，显示关于此数据集的主题相关的描述，显示关于此数据集的主题相关的描述</p>
            <div class="file-desc-detail">
              <p class="kpi">
                <Icon type="ios-eye"></Icon>
                34
              </p>
              <p class="kpi">
                <Icon type="ios-download-outline"></Icon>
                34
              </p>
              <p class="kpi">
                大小：34
              </p>
            </div>
          </div>
          <div class="file-action">
            <Tooltip content="编辑" placement="top">
              <Icon class="file-action-list" color="#2d8cf0" type="ios-create-outline"></Icon>
            </Tooltip>
            <Tooltip content="删除" placement="top">
              <Icon class="file-action-list" color="#ed3f14" type="ios-trash-outline"></Icon>
            </Tooltip>
            <Tooltip content="下载" placement="top">
              <Icon class="file-action-list" color="#1c2438" type="ios-cloud-download-outline"></Icon>
            </Tooltip>
          </div>
        </li>
      </ul>
      <div class="page-wrap">
        <Page :total="40" size="small" show-elevator show-sizer show-total></Page>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "dataset",
    data() {
      return {
        dataFilter: ''
      }
    }
  }
</script>

<style scoped lang="less">
  .content-container {
    .data-list {
      cursor: pointer;
      display: flex;
      padding: 20px 0;
      border-bottom: 1px solid #dddee1;
      margin-bottom: 20px;
      .file-icon {
        width: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .file-desc {
        width: 0;
        flex-grow: 1;
        .file-desc-title {
          margin-bottom: 8px;
        }
        .file-desc-content {
          color: #808695;
          margin-bottom: 10px;
        }
        .file-desc-detail {
          display: flex;
          .kpi {
            margin-right: 18px;
          }
        }
      }
      .file-action {
        display: flex;
        width: 200px;
        align-items: center;
        justify-content: space-around;
        &-list {
          font-size: 20px;
          cursor: pointer;
        }
      }

    }

    .add {
      width: 100%;
    }
    .page-wrap{
      text-align: right;
    }
    .icon-cnt {
      display: inline-block;
      width: 60px;
      line-height: 62px;
      height: 62px;
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAxlBMVEUAAAD/yij/xyj/oAD/uBf/nwD/nwD/uBT/yif/zCf/ySf/vxb/xiT/wiD/oAD/ySf/oAD/yyj/yyj/yyf/uBT/pgj/vhz/yij/yij/ySj/vx3/vhz/yyj/yyj/oAD/yyj/yij/uBX/tBP/oQD/ogD/xiv/oAD/yij/yij/wB7/oAD/yyj/oQD/vRv/uxn/yyj/oQD/oQD/uRf/ogD/yin/yyj/qg3/nwD/yij/oAD/yCX/uRf/wyH/pwb/vhz/sRD/rQ3/oQGUTC6CAAAAOHRSTlMAv0C/cFVAD6M0IQn88uh9e3ddUkoxGvro5NbU0ZaWjW5qXV0hEvrt6ubRyMjEtbSijXtwallRUN0eAPcAAAHiSURBVHja7dVHVptBEEXhEkk5IwEGk3HOsUoSDvvflI8GDrPun9Hr9v12cM/rYAAAAAAAAAAAAKjRcn/ybjfbvmlaTF5FM5Ilt++fRET5JTejiKig5GNE1FCyG1FFyXlEFSU3EVWU9F9EHSWTiCpK2qOoo+RrRB0l51FJySjqKGlH1FFyG5WULKKSkoP44+eP9WazcgmrwfD0Q/tBIfdrkYa/BqeHzUP0MrZWr5uGfHNRw2YhG5c1aBIieax+W2WGaO+x9Tw3ZO3iHuWF3Lu865wQ/UHyJjkoYBD3w4yQ716ANxkhsl/hv4YZIV6EvqV88SIsLOXai5C+7VdehCtL2fMi7BEihhA1hKghRA0haghRQ4gaQtSkQ3a8CDuEiCFEDSFqCFFDiBpC1BCihhA1hKghRA0haghRQ4gaQtQQooYQNYSoIUQNIWoIUUOIGkLUEKKGEDWEqCFEDSFqCFFDiBpC1BCihhA1/1FI14vQtZSeF6FnKW0vQtuSnnkBnlraYy9Ax9LmXoCZpd2duLyTO8swdXlTy9E/c3Fnfcsyc3Gfbav8h+uTZWu5sLfWwKXL6lgjs2OXdHxpDfUujlzO0UXPmuuOX7qU1rRrD7ScjzstCZ3xfGkAAAAAAAAAAACo0C8bqDsxzoZmvwAAAABJRU5ErkJggg==');
      background-position: center;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }

</style>
