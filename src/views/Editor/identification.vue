<template>
  <div class="main flex flex-column">
    <div class="header flex justify-between items-center">
      <p class="header-title">物品识别</p>
      <Icon class="icon-helper" @click="drawerShow = true" type="ios-help-circle" />
      <Drawer :width="300" title="物品识别标注工具帮助" :closable="false" v-model="drawerShow">
        <p class="helper-title fs-16">支持功能</p>
        <ul class="helper-list fs-14">
          <li>画布拖拽/缩放</li>
          <li>绘制矩形与多边形</li>
          <li>矩形/多边形大小位置调整</li>
          <li>多边形快捷添加/删除顶点</li>
          <li>区域列表与显示联动</li>
        </ul>
        <p class="helper-title fs-16">操作与快捷键说明</p>
        <ul class="helper-list fs-14">
          <li>鼠标拖拽画布、区域、顶点</li>
          <li>鼠标滚轮画布缩放</li>
          <li>
            点击矩形按钮绘制矩形 --
            <span class="text-danger">快捷键R</span>
          </li>
          <li>
            点击多边形按钮绘制矩形 --
            <span class="text-danger">快捷键E</span>
          </li>
          <li>
            点击移动按钮切换为移动模式 --
            <span class="text-danger">快捷键M</span>
          </li>
          <li>
            绘制时按
            <span class="text-danger">Ctrl/Command</span>键可拖拽/缩放画布
          </li>
          <li>右击画布完成多边形绘制</li>
          <li>点击多边形边缘可添加顶点</li>
          <li>右击多边形顶点可删除顶点</li>
          <li>拖拽顶点可调整区域大小和形状</li>
          <li>拖拽区域可调整区域位置</li>
        </ul>
      </Drawer>
    </div>
    <div class="content relative flex flex-grow-1 h0">
      <div class="content-canvas flex relative flex-grow-1">
        <div class="type-select-container absolute z-999">
          <RadioGroup v-model="actionType" vertical>
            <Radio :label="2" class="action-type-radio">
              <!--<Icon type="ios-browsers-outline" />-->
              <Icon type="ios-square-outline" />
              <span>矩形</span>
            </Radio>
            <Radio :label="3" class="action-type-radio">
              <Icon type="ios-star-outline" />
              <span>多边形</span>
            </Radio>
            <Radio :label="0" class="action-type-radio">
              <Icon type="ios-move" />
              <span>移动</span>
            </Radio>
          </RadioGroup>
        </div>
        <!-- <img class="target-img" :src="monaLisa" /> -->
        <ul
          v-show="menuData.show"
          class="menu absolute"
          :style="`left: ${menuData.x}px; top: ${menuData.y}px;`"
        >
          <li class="menu-item" @click="handleDeleteRegion">删除</li>
        </ul>
        <svg
          class="J_mark_svg mark-svg"
          :class="`action-${actionType}`"
          @keyup.delete="handleDeleteRegion"
          @contextmenu="svgContextMenu"
        >
          <g
            ref="area"
            class="J_mark"
            :class="{'ctrl-key-down': ctrlKeyDown}"
            @click="handleMarkAreaClick"
            @mousemove="handleMarkAreaMouseMove"
            @contextmenu="handleMarkAreaContextMenu"
          >
            <!--<rect height="100" width="100" fill="black" />-->
            <image
              id="mark-img"
              v-show="width"
              :width="width"
              :height="height"
              :xlink:href="resource_url"
            />
            <g class="regions-container">
              <g class="region" v-for="(item, index) in regionList" :key="index">
                <!-- 正方形 -->
                <rect
                  class="rect"
                  :class="{'hover': hoverIndex === index, 'active': selectedItem && (selectedItem.id === item.id)}"
                  v-if="item.type === 'rect'"
                  v-show="regionItemShow(item.metaType)"
                  :x="item.x"
                  :y="item.y"
                  :width="item.width"
                  :height="item.height"
                  fill="rgba(94, 158, 224, 0.5)"
                  stroke="#6da1ff"
                  stroke-width="1"
                  @mousedown="handleRegionClick(item.id, $event)"
                  @click="handleStopPropagation"
                  @contextmenu="handleRegionContextMenu($event)"
                  @mouseenter="handleRegionMetaMouseIn(index)"
                  @mouseleave="handleRegionMetaMouseLeave(index)"
                />
                <g
                  v-show="selectedItem && (selectedItem.id === item.id) && regionItemShow(item.metaType)"
                >
                  <!-- 多边形点 -->
                  <circle
                    v-for="(point, pIndex) in selectedItemPoints"
                    :key="pIndex"
                    class="point"
                    :data-point-action-type="getPointActionType(pIndex)"
                    :class="`point-control-${getPointActionType(pIndex)}`"
                    :r="circleRadius"
                    :cx="point.x"
                    :cy="point.y"
                  />
                </g>

                <polygon
                  class="polygon"
                  :class="{'hover': hoverIndex === index, 'active': selectedItem && (selectedItem.id === item.id)}"
                  v-if="item.type === 'polygon'"
                  v-show="regionItemShow(item.metaType)"
                  stroke="#6da1ff"
                  stroke-width="1"
                  fill="rgba(94, 158, 224, 0.5)"
                  :points="getPolygonPoints(item)"
                  @mousedown="handleRegionClick(item.id, $event)"
                  @click="handleStopPropagation"
                  @contextmenu="handleRegionContextMenu($event)"
                  @mouseenter="handleRegionMetaMouseIn(index)"
                  @mouseleave="handleRegionMetaMouseLeave(index)"
                />
                <g v-if="item.type === 'polygon'">
                  <!-- 多边形跟踪线段 -->
                  <line
                    class="polyline"
                    v-for="(lp, lpIndex) in item.points"
                    :key="lpIndex"
                    stroke="transparent"
                    stroke-width="10"
                    fill="none"
                    @click="handlePolyLine(item, lpIndex,$event)"
                    :x1="lp.x"
                    :y1="lp.y"
                    :x2="lpIndex === (item.points.length - 1) ? item.points[0].x : item.points[lpIndex + 1].x"
                    :y2="lpIndex === (item.points.length - 1) ? item.points[0].y : item.points[lpIndex + 1].y"
                  />
                </g>
                <!-- 多边形点 -->
                <g
                  v-show="selectedItem && (selectedItem.id === item.id) && regionItemShow(item.metaType)"
                >
                  <circle
                    v-for="(point, pIndex) in item.points"
                    :key="pIndex"
                    class="point point-control"
                    data-point-action-type="polygon"
                    :data-index="pIndex"
                    :r="circleRadius"
                    :cx="point.x"
                    :cy="point.y"
                    @contextmenu="handlePolygonPointContextMenu(item, pIndex,$event)"
                  />
                </g>
              </g>
            </g>
            <g
              v-if="currentDraw && (currentDraw.type === 'rect') && (currentDraw.start.x !== currentDraw.drag.x)"
            >
              <rect
                :x="Math.min(currentDraw.start.x, currentDraw.drag.x)"
                :y="Math.min(currentDraw.start.y, currentDraw.drag.y)"
                :height="Math.abs(currentDraw.drag.y - currentDraw.start.y)"
                :width="Math.abs(currentDraw.drag.x - currentDraw.start.x)"
                fill="rgba(94, 158, 224, 0.5)"
                stroke="#6da1ff"
                stroke-width="1"
              />
            </g>
            <!-- 正在编辑的多边形 -->
            <g v-if="currentDraw && (currentDraw.type === 'polygon')">
              <polygon
                stroke="#6da1ff"
                stroke-width="1"
                fill="rgba(94, 158, 224, 0.5)"
                :points="getCurrentPolygonPoints()"
              />
              <circle
                v-for="(point, pIndex) in currentDraw.points"
                :key="pIndex"
                class="point point-control"
                data-point-action-type="polygon"
                :r="circleRadius"
                :cx="point.x"
                :cy="point.y"
                @click="handleMarkAreaContextMenu($event, true)"
              />
            </g>
          </g>
        </svg>
      </div>
      <div class="panel-right relative">
        <div class="tool-container absolute flex">
          <Tooltip content="放大" placement="top">
            <svg
              class="icon-enlarge"
              viewBox="0 0 1024 1024"
              width="32"
              height="32"
              @click="svgZoom(true)"
            >
              <path
                d="M465.27431111 762.21276615c-155.64772125 0-282.27483648-126.62711523-282.27483762-282.27483648 0-155.64772125 126.62853405-282.27625643 282.27483762-282.27625642s282.27483648 126.62853405 282.27483648 282.27625642-126.62711523 282.27483648-282.27483648 282.27483648z m0-536.15794404c-139.99110258 0-253.88310642 113.89200498-253.88310756 253.88452637 0 139.99110258 113.89200498 253.88310642 253.88310756 253.88310755s253.88310642-113.89200498 253.88310642-253.88310755c0-139.99252139-113.89058503-253.88452637-253.88310642-253.88452637z"
              />
              <path
                d="M875.82724096 857.53515918a14.13908139 14.13908139 0 0 1-9.4033408-3.56600035L656.60617842 668.25459485c-5.87141006-5.19710606-6.41795072-14.16747349-1.22084466-20.03888242 5.19568611-5.86857017 14.16605355-6.41795072 20.03888242-1.22084466l209.81772288 185.71456284c5.87141006 5.19710606 6.41795072 14.16747349 1.22084465 20.03888356a14.16747349 14.16747349 0 0 1-10.63554275 4.78684501zM465.27431111 641.14900992c-7.84037661 0-14.19586446-6.35690781-14.1958656-14.19586446V340.16544313c0-7.84037661 6.35548899-14.19586446 14.1958656-14.19586446s14.19586446 6.35548899 14.19586446 14.19586446v286.78628238c0 7.84037661-6.35548899 14.19728441-14.19586446 14.19728441z"
              />
              <path
                d="M608.66958109 497.7565787H321.88187875c-7.84037661 0-14.19586446-6.35548899-14.19586446-14.19586446s6.35548899-14.19586446 14.19586446-14.1958656h286.78770234c7.83895666 0 14.19586446 6.35548899 14.1958656 14.1958656s-6.35548899 14.19586446-14.1958656 14.19586446z"
              />
            </svg>
          </Tooltip>
          <Tooltip content="缩小" placement="top">
            <svg
              class="icon-shrink"
              viewBox="0 0 1024 1024"
              width="32"
              height="32"
              @click="svgZoom(false)"
            >
              <path
                d="M465.27431111 762.21276615c-155.64772125 0-282.27483648-126.62711523-282.27483762-282.27483648 0-155.64772125 126.62853405-282.27625643 282.27483762-282.27625642s282.27483648 126.62853405 282.27483648 282.27625642-126.62711523 282.27483648-282.27483648 282.27483648z m0-536.15794404c-139.99110258 0-253.88310642 113.89200498-253.88310756 253.88452637 0 139.99110258 113.89200498 253.88310642 253.88310756 253.88310755s253.88310642-113.89200498 253.88310642-253.88310755c0-139.99252139-113.89058503-253.88452637-253.88310642-253.88452637z"
              />
              <path
                d="M875.82724096 857.53515918a14.13908139 14.13908139 0 0 1-9.4033408-3.56600035L656.60617842 668.25459485c-5.87141006-5.19710606-6.41795072-14.16747349-1.22084466-20.03888242 5.19568611-5.86857017 14.16605355-6.41795072 20.03888242-1.22084466l209.81772288 185.71456284c5.87141006 5.19710606 6.41795072 14.16747349 1.22084465 20.03888356a14.16747349 14.16747349 0 0 1-10.63554275 4.78684501zM608.66958109 497.7565787H321.88187875c-7.84037661 0-14.19586446-6.35548899-14.19586446-14.19586446s6.35548899-14.19586446 14.19586446-14.1958656h286.78770234c7.83895666 0 14.19586446 6.35548899 14.1958656 14.1958656s-6.35548899 14.19586446-14.1958656 14.19586446z"
              />
            </svg>
          </Tooltip>
          <Tooltip content="适应画布" placement="top">
            <svg
              width="22"
              height="22"
              viewBox="0 0 182 174"
              class="icon-adjust-screen"
              @click="adjustScreen"
            >
              <path
                d="M65.000,108.000 L66.000,108.000 L66.000,173.000 L65.000,173.000 L65.000,108.000 Z"
              />
              <path
                d="M66.000,108.000 L66.000,109.000 L1.000,109.000 L1.000,108.000 L66.000,108.000 Z"
              />

              <path
                d="M117.000,108.000 L116.000,108.000 L116.000,173.000 L117.000,173.000 L117.000,108.000 Z"
              />
              <path
                d="M116.000,108.000 L116.000,109.000 L181.000,109.000 L181.000,108.000 L116.000,108.000 Z"
              />

              <path d="M65.000,66.000 L66.000,66.000 L66.000,1.000 L65.000,1.000 L65.000,66.000 Z" />
              <path d="M66.000,66.000 L66.000,65.000 L1.000,65.000 L1.000,66.000 L66.000,66.000 Z" />

              <path
                d="M117.000,66.000 L116.000,66.000 L116.000,1.000 L117.000,1.000 L117.000,66.000 Z"
              />
              <path
                d="M116.000,66.000 L116.000,65.000 L181.000,65.000 L181.000,66.000 L116.000,66.000 Z"
              />

              <circle cx="91" cy="87" r="18" fill="#555" />
            </svg>
          </Tooltip>
          <Tooltip content="原始大小" placement="top">
            <svg
              class="icon-reset"
              viewBox="0 0 1024 1024"
              width="32"
              height="32"
              @click="svgZoom(true, 1)"
            >
              <path
                d="M128 368h512v16H128zM624 384h16v512h-16zM128 880h496v16H128zM128 384h16v496h-16zM384 128h16v240h-16zM400 128h496v16H400zM880 144h16v496h-16z"
              />
              <path d="M624 624h272v16H624z" />
            </svg>
          </Tooltip>
        </div>
        <!--<Radio @on-change="handleRectDraw">矩形</Radio>-->
        <!--<Checkbox :value="actionType === enumActionType.drawRect" @on-change="handleRectDraw">矩形</Checkbox>-->
        <!--<Checkbox :value="actionType === enumActionType.drawPolygon" @on-change="handlePolygonDraw">多边形</Checkbox>-->

        <div class="h-100 flex flex-column">
          <div class="label-title flex items-center justify-between">
            <p>区域</p>
          </div>
          <p class="empty-tip" v-show="!regionList.length">请在左侧操作区选择矩形或多边形绘制工具绘制对应的标注区域~</p>
          <ul class="content-region-list h-0 flex-grow-1 overflow-auto">
            <li
              class="item"
              :class="{'hover': hoverIndex === index, 'active': selectedItem && (selectedItem.id === item.id)}"
              v-for="(item, index) in regionList"
              :key="index"
              @mouseenter="handleRegionMetaMouseIn(index)"
              @mouseleave="handleRegionMetaMouseLeave(index)"
              @click="handleRegionSelect(index)"
            >
              <div class="flex items-center">
                <div style="width: 25%;min-width: 100px;" class="flex items-center">
                  <p class="field-index">{{index + 1}}</p>
                  <p class="ml-15 field-type">{{item.type === 'rect' ? '矩形' : '多边形'}}</p>
                </div>

                <Input
                  :disabled="readOnly"
                  class="ml-15 flex-grow-1 w0"
                  v-model="item.text"
                  type="text"
                  placeholder="请输入物品类别"
                />
                <Icon @click="handleDeleteRegion(item.id)" class="icon-trash" type="ios-trash" />
              </div>

              <div
                class="flex items-center"
                style="padding: 10px 0;"
                v-for="tagItem in mark_tags"
                :key="tagItem.tag"
              >
                <Tooltip
                  :content="tagItem.tag"
                  style="width: 25%;min-width: 100px;"
                  placement="right"
                >
                  <div class="flex items-center justify-end">
                    <p style="padding-top: 3px;text-align: right" class="ellipsis">{{tagItem.tag}}</p>:
                  </div>
                </Tooltip>
                <Select
                  clearable
                  :disabled="readOnly"
                  style="margin-left: 15px;width: 0;margin-right: 35px"
                  class="flex-grow-1"
                  v-if="!!tagItem.isMulti"
                  multiple
                  v-model="getTargetTag(tagItem.tag, index).types"
                >
                  <Option v-for="tag in tagItem.tagTypeList" :value="tag" :key="tag">{{ tag }}</Option>
                </Select>
                <Select
                  clearable
                  :disabled="readOnly"
                  style="margin-left: 15px;width: 0;margin-right: 35px"
                  class="flex-grow-1"
                  v-if="!tagItem.isMulti"
                  v-model="getTargetTag(tagItem.tag, index).type"
                >
                  <Option v-for="tag in tagItem.tagTypeList" :value="tag" :key="tag">{{ tag }}</Option>
                </Select>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import monaLisa from "@/assets/img/test.jpeg";
import { randomString } from "@/libs/utils.js";

// 计算 offset 数值，如果传入了 ele 参数，则计算基于该 ele 的 offset
const getOffset = (e, ele) => {
  const evt = e || window.event;

  const srcObj = ele || evt.target || evt.srcElement;

  return {
    offsetX: evt.clientX - srcObj.getBoundingClientRect().left, // 返回元素的大小及其相对于视口的位置
    offsetY: evt.clientY - srcObj.getBoundingClientRect().top, // 点击位置距离当前body可视区域的x，y坐标
  };
};

const enumActionType = {
  move: 0,
  select: 1,
  drawRect: 2,
  drawPolygon: 3,
};

const rectPointDirections = ["tl", "tm", "tr", "ml", "mr", "bl", "bm", "br"];

export default {
  name: "Main",
  components: {},
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      readOnly: false,
      resource_url: "",
      svg: null,
      ctrlKeyDown: false,
      ready: false,
      width: 0,
      height: 0,
      circleRadius: 6,
      drawerShow: false,
      menuData: {
        show: false,
        x: 0,
        y: 0,
      },
      transform: {
        x: 0,
        y: 0,
        k: 1,
      },
      zoom: null,
      actionType: enumActionType.move,
      enumActionType,
      regionList: [],
      currentDraw: null,
      selectedItem: null,
      pointMove: null,
      hoverIndex: -1,

      // 全部、文字、图片、视频
      filterType: "全部",

      mark_tags: [],
      tagRes: [],
    };
  },
  mounted() {
    // 初始化外界调用接口
    window.initMarkData = this.initData;
    window.markSubmit = this.handleSubmit;
    window.markBad = this.handleMarkBad;

    // 选中 svg 元素
    this.svg = d3.select(".J_mark_svg");

    // 初始化svg画布缩放事件
    this.initZoom();

    // 适应屏幕
    // this.adjustScreen();

    this.initDragEvent();

    this.initKeyEvents();

    this.handleNext();
  },

  computed: {
    selectedItemPoints() {
      if (this.selectedItem && this.selectedItem.type === "rect") {
        const { x, y, width, height } = this.selectedItem;
        return [
          { x, y },
          { x: x + width / 2, y },
          { x: x + width, y },
          { x, y: y + height / 2 },
          { x: x + width, y: y + height / 2 },
          { x, y: y + height },
          { x: x + width / 2, y: y + height },
          { x: x + width, y: y + height },
        ];
      }
      return [];
    },
  },

  watch: {
    selectedItem() {
      this.$nextTick(() => {
        this.initPointsDragEvent();
      });
    },
  },

  methods: {
    getTargetTag(tag, index) {
      // console.log(tag, index);

      const tagIndex = this.regionList[index].tags.findIndex(
        (item) => item.tag === tag
      );
      return this.regionList[index].tags[tagIndex];
    },

    handleSelectChange(item, e) {
      if (["image", "video"].indexOf(item.metaType) > -1) {
        item.text = "";
      }
    },

    handleNext() {
      window.initMarkData({
        resource_url: monaLisa,
        readOnly: false,
        mark_tags: [
          {
            tag: "标签1标签1标签1标签1标签1标签1",
            isMulti: 0,
            tagTypeList: ["1", "2", "3"],
          },
          {
            tag: "标签2",
            isMulti: 1,
            tagTypeList: ["a", "b", "c"],
          },
        ],
        mark_result: {
          bad: false,
          width: 1000,
          height: 900,
          file: monaLisa,
          regions: [
            {
              height: 419.2394561767578,
              metaType: "image",
              text: "",
              type: "rect",
              width: 350.2183532714844,
              x: 290.8309631347656,
              y: 148.2675018310547,
              tags: [
                {
                  tag: "标签1标签1标签1标签1标签1标签1",
                  type: "1",
                },
                {
                  tag: "标签2",
                  types: ["a", "b"],
                },
              ],
            },
            {
              height: 311.873291015625,
              metaType: "text",
              text: "dasdas",
              type: "rect",
              width: 278.6408996582031,
              x: 301.0563049316406,
              y: 677.4295043945312,
              tags: [
                {
                  tag: "标签1标签1标签1标签1标签1标签1",
                  type: "2",
                },
                {
                  tag: "标签2",
                  types: ["a", "c"],
                },
              ],
            },
          ],
        },
      });
    },

    async initData({
      resource_url = "",
      readOnly = false,
      mark_tags = [],
      mark_result,
    }) {
      // 清除 regions
      // this.clearAllRegions();
      this.pointMove = null;
      this.currentDraw = null;

      this.selectedItem = null;
      this.regionList = [];

      // 重新初始化是否为坏数据
      this.bad = false;

      // 加载完成状态切换
      this.ready = false;

      this.readOnly = readOnly;

      this.mark_tags = mark_tags;

      this.width = 0;
      this.height = 0;

      this.resource_url = resource_url;
      this.initImage(mark_result);
    },

    handleSubmit() {
      if (!this.ready) {
        this.$Message.error({
          content: "图片尚未加载完成",
        });
        return {
          valid: false,
          data: null,
        };
      }

      if (!this.regionList.length) {
        this.$Message.error({
          content: "标注结果提交失败，未标注任何区域",
        });
        return {
          valid: false,
          data: null,
        };
      }

      if (this.pointMove) {
        this.$Message.error({
          content: "标注结果提交失败，多边形区域尚未绘制完成",
        });
        return {
          valid: false,
          data: null,
        };
      }

      // 遍历 regionList 校验 metaType 和 text 字段
      // let metaTypeValid = true;
      let textValid = true;

      this.regionList.forEach((item) => {
        // if (!item.metaType) {
        //   metaTypeValid = false;
        // }

        if (!item.text.trim()) {
          textValid = false;
        }
      });

      // if (!metaTypeValid) {
      //   this.$Message.error({
      //     content: '标注结果提交失败，需指定区域类型',
      //   });
      //   return {
      //     valid: false,
      //     data: null,
      //   };
      // }

      if (!textValid) {
        this.$Message.error({
          content: "标注结果提交失败，需指定物品名称",
        });
        return {
          valid: false,
          data: null,
        };
      }

      // this.$Message.success({
      //   content: '标注结果提交成功',
      // });

      return {
        valid: true,
        data: {
          file: this.resource_url,
          width: this.width,
          height: this.height,
          bad: false,
          regions: this.regionList.map(({ id, ...other }) => other),
        },
      };
    },

    handleMarkBad() {
      // if (!this.ready) {
      //   this.$Message.error({
      //     content: '图片尚未加载完成',
      //   });
      //   return {
      //     valid: false,
      //     data: null,
      //   };
      // }
      // this.$Message.success({
      //   content: '已标注为坏数据',
      // });
      return {
        valid: true,
        data: {
          file: this.resource_url,
          width: this.width,
          height: this.height,
          bad: true,
          regions: [],
        },
      };
    },

    regionItemShow(metaType) {
      const currentFilterType = this.currentFilterType();
      if (currentFilterType === "all") {
        return true;
      }

      return metaType === currentFilterType;
    },
    currentFilterType() {
      const filterTypeMap = {
        全部: "all",
        文字: "text",
        图片: "image",
        视频: "video",
      };

      return filterTypeMap[this.filterType];
    },

    initImage(mark_result = { regions: [] }) {
      const image = new Image();

      image.src = this.resource_url;

      image.onload = () => {
        const { naturalWidth, naturalHeight } = image;

        this.width = naturalWidth;
        this.height = naturalHeight;

        if (this.width < 500) {
          this.circleRadius = 4;
        }

        this.ready = true;

        const regions = mark_result
          ? mark_result.regions
            ? mark_result.regions
            : []
          : [];

        this.regionList = regions.map((region) => ({
          id: randomString(8),
          ...region,
        }));

        this.$nextTick(() => {
          this.adjustScreen();
          this.initRectDragEvent();
        });
      };
    },
    /*
     * @desc svg 右键点击事件，禁止弹出浏览器菜单
     */
    svgContextMenu(e) {
      e.preventDefault();
      this.resetMenuData();

      return false;
    },

    resetMenuData() {
      this.menuData = {
        show: false,
        x: 0,
        y: 0,
      };
    },

    handleRegionContextMenu(e) {
      e.preventDefault();
      e.stopPropagation();

      const { offsetX, offsetY } = getOffset(e, this.svg.node());

      this.menuData = {
        show: true,
        x: offsetX,
        y: offsetY,
      };
    },

    handlePolygonPointContextMenu(item, index, e) {
      e.preventDefault();
      e.stopPropagation();
      this.resetMenuData();

      item.points.splice(index, 1);

      if (item.points.length < 3) {
        const regionIndex = this.regionList.findIndex(
          (region) => region.id === item.id
        );
        this.regionList.splice(regionIndex, 1);
        this.selectedItem = null;
      }
      return false;
    },

    getCurrentPolygonPoints() {
      return `${this.currentDraw.points.reduce(
        (v, point) => `${v ? `${v},` : ""} ${point.x} ${point.y}`,
        ""
      )}${this.pointMove ? `, ${this.pointMove.x} ${this.pointMove.y}` : ""}`;
    },

    getPolygonPoints(item, isLine) {
      if (item.points && item.points.length) {
        const points = item.points.reduce(
          (v, point) => `${v ? `${v},` : ""} ${point.x} ${point.y}`,
          ""
        );
        if (isLine) {
          return `${points}, ${item.points[0].x} ${item.points[0].y}`;
        }
        return points;
      }
      return "";
    },

    handleMarkAreaClick(e) {
      this.resetMenuData();

      if (this.readOnly) {
        return;
      }

      if (
        this.actionType === enumActionType.drawPolygon &&
        !window.event.ctrlKey &&
        !window.event.metaKey
      ) {
        // 画多边形起始
        const { offsetX, offsetY } = getOffset(e, this.svg.node());

        // 缩放后，鼠标的坐标拖拽点的变换
        const transform = d3.zoomTransform(this.svg.node());

        // 对路径向量进行变换处理，换算成实际点的距离
        const [finalX, finalY] = transform.invert([offsetX, offsetY]);

        if (this.currentDraw) {
          this.currentDraw.points = [
            ...this.currentDraw.points,
            {
              x: finalX,
              y: finalY,
            },
          ];
        } else {
          this.currentDraw = {
            type: "polygon",
            points: [
              {
                x: finalX,
                y: finalY,
              },
            ],
          };
        }
      }
    },

    handleMarkAreaMouseMove(e) {
      if (this.readOnly) {
        return;
      }
      console.log(this.actionType);
      if (
        this.actionType !== enumActionType.drawPolygon ||
        !this.currentDraw ||
        !this.currentDraw.points.length ||
        window.event.ctrlKey ||
        window.event.metaKey
      ) {
        return;
      }
      const { offsetX, offsetY } = getOffset(e, this.svg.node());

      // 缩放后，鼠标的坐标拖拽点的变换
      const transform = d3.zoomTransform(this.svg.node());

      // 对路径向量进行变换处理
      const [finalX, finalY] = transform.invert([offsetX, offsetY]);

      this.pointMove = {
        x: finalX,
        y: finalY,
      };
    },

    handleMarkAreaContextMenu(e, isPoint) {
      e.stopPropagation();
      e.preventDefault();

      if (this.readOnly) {
        return;
      }

      this.resetMenuData();

      if (
        this.actionType === enumActionType.drawPolygon &&
        this.pointMove &&
        !window.event.ctrlKey &&
        !window.event.metaKey
      ) {
        if (
          !isPoint &&
          !this.currentDraw.points.find(
            (point) =>
              Math.abs(point.x - this.pointMove.x) +
                Math.abs(point.y - this.pointMove.y) <
              30
          )
        ) {
          this.currentDraw.points = [
            ...this.currentDraw.points,
            this.pointMove,
          ];
        } else {
          e.stopPropagation();
        }

        if (this.currentDraw.points.length > 2) {
          this.regionList = [
            ...this.regionList,
            {
              id: randomString(8),
              type: "polygon",
              points: this.currentDraw.points,
              text: "",
              tags: this.mark_tags.map((tagItem) => ({
                tag: tagItem.tag,
                ...(tagItem.isMulti ? { types: [] } : { type: null }),
              })),
            },
          ];

          this.selectedItem = this.regionList[this.regionList.length - 1];
        }
        this.pointMove = null;
        this.currentDraw = null;
        this.$nextTick(() => {
          this.initPolygonDragEvent();
          this.initPointsDragEvent();
        });
      }
    },

    handleDeleteRegion(id) {
      if (this.readOnly) {
        return;
      }

      if (!this.selectedItem && !id) {
        this.resetMenuData();
        return;
      }

      this.$Modal.confirm({
        title: "删除区域",
        content: "是否要删除该区域?",
        okText: "删除",
        cancelText: "取消",
        onOk: () => {
          const index = this.regionList.findIndex(
            (item) =>
              item.id === (this.selectedItem ? this.selectedItem.id : id)
          );
          this.regionList.splice(index, 1);
          this.selectedItem = null;
          this.resetMenuData();
        },
        onCancel: () => {
          this.resetMenuData();
        },
      });
    },
    handleRegionClick(id, e) {
      e.stopPropagation();
      this.resetMenuData();

      if (!this.selectedItem || this.selectedItem.id !== id) {
        this.selectedItem = this.regionList.find((item) => item.id === id);
      }
    },
    handlePolyLine(item, lpIndex, e) {
      e.stopPropagation();

      if (this.readOnly) {
        return;
      }

      this.resetMenuData();

      this.selectedItem = item;
      const { offsetX, offsetY } = getOffset(e, this.svg.node());

      // 缩放后，鼠标的坐标拖拽点的变换
      const transform = d3.zoomTransform(this.svg.node());

      // 对路径向量进行变换处理
      const [finalX, finalY] = transform.invert([offsetX, offsetY]);

      item.points.splice(lpIndex + 1, 0, {
        x: finalX,
        y: finalY,
      });

      this.$nextTick(() => {
        this.initPointsDragEvent();
      });
    },
    handleStopPropagation(e) {
      e.stopPropagation();
      this.resetMenuData();
    },
    getPointActionType(index) {
      return rectPointDirections[index];
    },

    handleRegionSelect(index) {
      this.selectedItem = this.regionList[index];
    },

    /*
     * @desc 初始化画布缩放
     */
    initZoom() {
      const $this = this;

      this.zoom = d3
        .zoom()
        // .scaleExtent([0.4, 5])
        // .translateExtent([[-5000, -5000], [5000, 5000]])
        .on("start", () => {
          this.resetMenuData();

          // 切换鼠标显示
          $this.svg.classed("active", false);
          // console.log('start');
        })
        .on("zoom", () => {
          // 获取当前变换信息
          const { x, y, k } = d3.event.transform;

          // 对画布进行缩放变换
          d3.select(".J_mark").attr(
            "transform",
            d3.zoomIdentity.translate(x, y).scale(k)
          );
          // .attr("transform", `translate(${x}px,${y}px) scale(1)`);
        })
        .on("end", () => {
          // 切换鼠标显示
          $this.svg.classed("active", false);
          // console.log('end');
        })
        // FIXME 此处高能
        // console.log(d3.event.target.id === 'mark-img');
        .filter(
          (e) =>
            d3.event.target.id !== "mark-img" ||
            this.actionType === enumActionType.move ||
            window.event.ctrlKey ||
            window.event.metaKey
        );

      // 全局缩放逻辑, 干掉了滚轮缩放
      // console.log($this.svg);
      // 禁用双击放大
      $this.svg.call(this.zoom).on("dblclick.zoom", null);

      // 根据传入的 transform 参数初始化缩放
      $this.svg.call(
        this.zoom.transform,
        d3.zoomIdentity
          .translate(this.transform.x, this.transform.y)
          .scale(this.transform.k)
      );
    },

    /**
     * @desc svgZoom 操作，对应放大和缩小操作, 若指定了 k 值，则会忽略 status，缩放系数指定为 k
     * @param status  status 为 true 则是放大操作，为 false 则是缩小操作
     * @param k 指定缩放系数
     */
    svgZoom(status, k) {
      // 获取画布元素缩放后的缩放信息

      if (k) {
        this.zoom.scaleTo(d3.select(this.svg.node()), k);
        return;
      }

      const ratio = status ? 1.1 : 0.9;

      // 对画布进行缩放变换
      this.zoom.scaleBy(d3.select(this.svg.node()), ratio);
    },

    /*
     * @desc 适应屏幕
     */
    adjustScreen() {
      // 当前 transform 偏移量与缩放
      const svgNode = d3.select(this.svg.node());

      const graphEle = document.getElementsByClassName("J_mark")[0];

      // const {k: k0} = d3.zoomTransform(svgNode);

      const svgBox = this.svg.node().getBoundingClientRect();

      const graphBox = graphEle.getBoundingClientRect();

      // 偏移向量

      const wRatio = svgBox.width / graphBox.width;
      const hRatio = svgBox.height / graphBox.height;

      // 计算缩放系数
      let kRatio = 1;
      let k = 1;

      kRatio = wRatio < hRatio ? wRatio : hRatio;

      const k1 = kRatio;

      // 不管缩小还是放大，最终的放大系数都不会超过1
      k = k1 > 1 ? 1 : k1;

      // 缩放到指定大小
      this.zoom.scaleBy(svgNode, k1);

      const transData = graphEle
        .getAttribute("transform")
        .match(/scale\(([.\d]+)\)/);

      const k2 = transData ? (transData[1] ? parseFloat(transData[1]) : 1) : 1;

      const graphBox1 = graphEle.getBoundingClientRect();

      const {
        x: x0,
        y: y0,
        width: w0,
        height: h0,
        top: top0,
        left: left0,
      } = svgBox;

      const {
        x: x1,
        y: y1,
        width: w1,
        height: h1,
        top: top1,
        left: left1,
      } = graphBox1;

      const posX0 = x0 || left0 || 0;
      const posX1 = x1 || left1 || 0;

      const posY0 = y0 || top0 || 0;
      const posY1 = y1 || top1 || 0;

      // 计算偏移量
      const deltaTransX = posX0 + w0 / 2 - w1 / 2 - posX1;
      const deltaTransY = posY0 + h0 / 2 - h1 / 2 - posY1;

      this.zoom.translateBy(svgNode, deltaTransX / k2, deltaTransY / k2);
    },

    handleRectDraw(value) {
      if (value) {
        this.actionType = enumActionType.drawRect;
      } else {
        this.actionType = enumActionType.move;
      }
    },

    handlePolygonDraw(value) {
      if (value) {
        this.actionType = enumActionType.drawPolygon;
      } else {
        this.actionType = enumActionType.move;
      }
    },

    initDragEvent() {
      d3.select("#mark-img").call(
        d3
          .drag()
          .on("start", (d) => {
            this.resetMenuData();

            this.currentDraw = {
              type: "rect",
              start: {
                x: d3.event.x,
                y: d3.event.y,
              },
              drag: {
                x: d3.event.x,
                y: d3.event.y,
              },
            };
          })
          .on("drag", (d) => {
            // // 鼠标坐标
            const { dx, dy } = d3.event;

            this.currentDraw.drag.x += dx;
            this.currentDraw.drag.y += dy;
          })
          .on("end", (d) => {
            const {
              start: { x: startX, y: startY },
              drag: { x: endX, y: endY },
            } = this.currentDraw;

            if (startX === endX || startY === endY) {
              this.currentDraw = null;
              return;
            }

            const width = Math.abs(endX - startX);
            const height = Math.abs(endY - startY);

            this.regionList = [
              ...this.regionList,
              {
                id: randomString(8),
                type: "rect",
                x: Math.min(startX, endX),
                y: Math.min(startY, endY),
                width: width < 10 ? 10 : width,
                height: height < 10 ? 10 : height,
                text: "",
                tags: this.mark_tags.map((tagItem) => ({
                  tag: tagItem.tag,
                  ...(tagItem.isMulti ? { types: [] } : { type: null }),
                })),
              },
            ];

            this.currentDraw = null;
            this.selectedItem = this.regionList[this.regionList.length - 1];
            this.rectLimit();
            this.$nextTick(() => {
              this.initRectDragEvent();
              this.initPointsDragEvent();
            });
          })
          .filter(
            (e) =>
              this.actionType === enumActionType.drawRect &&
              !this.readOnly &&
              !window.event.ctrlKey &&
              !window.event.metaKey
          )
      );
    },
    initPointsDragEvent() {
      let pointDirection = "";
      let pointIndex = "";
      d3.selectAll("circle.point").call(
        d3
          .drag()
          .on("start", (d) => {
            this.resetMenuData();

            pointDirection = d3.event.sourceEvent.target.getAttribute(
              "data-point-action-type"
            );
            pointIndex = d3.event.sourceEvent.target.getAttribute("data-index");
            d3.event.sourceEvent.stopPropagation();
          })
          .on("drag", (d) => {
            d3.event.sourceEvent.stopPropagation();

            const { dx, dy } = d3.event;

            const { x, y, width, height } = this.selectedItem;

            switch (pointDirection) {
              case "tl":
                if (width >= 10 && height >= 10) {
                  this.selectedItem.x += dx;
                  this.selectedItem.y += dy;

                  this.selectedItem.width -= dx;
                  this.selectedItem.height -= dy;
                }

                if (width < 10 && dx < 0) {
                  this.selectedItem.x += dx;
                  this.selectedItem.width -= dx;
                }

                if (height < 10 && dy < 0) {
                  this.selectedItem.y += dy;
                  this.selectedItem.height -= dy;
                }

                if (width < 5) {
                  this.selectedItem.width = 5;
                }

                if (height < 5) {
                  this.selectedItem.height = 5;
                }

                break;
              case "tm":
                if (height >= 10 || (height < 10 && dy < 0)) {
                  this.selectedItem.y += dy;
                  this.selectedItem.height -= dy;
                }

                if (height < 5) {
                  this.selectedItem.height = 5;
                }
                break;
              case "tr":
                if (width >= 10 && height >= 10) {
                  this.selectedItem.y += dy;
                  this.selectedItem.height -= dy;
                  this.selectedItem.width += dx;
                }

                if (width < 10) {
                  this.selectedItem.width = 10;
                }

                if (height < 10 && dy < 0) {
                  this.selectedItem.y += dy;
                  this.selectedItem.height -= dy;
                }

                if (height < 5) {
                  this.selectedItem.height = 5;
                }
                break;
              case "ml":
                if (width >= 10 || (width < 10 && dx < 0)) {
                  this.selectedItem.x += dx;
                  this.selectedItem.width -= dx;
                }

                if (width < 5) {
                  this.selectedItem.width = 5;
                }
                break;
              case "mr":
                if (width >= 10 || (width < 10 && dx < 0)) {
                  this.selectedItem.width += dx;
                }

                if (width < 10) {
                  this.selectedItem.width = 10;
                }
                break;
              case "bl":
                if (width >= 10 && height >= 10) {
                  this.selectedItem.x += dx;
                  this.selectedItem.height += dy;
                  this.selectedItem.width -= dx;
                }

                if (height < 10) {
                  this.selectedItem.height = 10;
                }

                if (width < 10 && dx < 0) {
                  this.selectedItem.x += dx;
                  this.selectedItem.width -= dx;
                }

                if (width < 5) {
                  this.selectedItem.width = 5;
                }
                break;
              case "bm":
                if (height >= 10 || (height < 10 && dy > 0)) {
                  this.selectedItem.height += dy;
                }

                if (height < 5) {
                  this.selectedItem.height = 5;
                }
                break;
              case "br":
                if (width >= 10 && height >= 10) {
                  this.selectedItem.width += dx;
                  this.selectedItem.height += dy;
                }

                if (width < 10) {
                  this.selectedItem.width = 10;
                }

                if (height < 10) {
                  this.selectedItem.height = 10;
                }
                break;
              case "polygon":
                const point = this.selectedItem.points[pointIndex];
                point.x += dx;
                point.y += dy;

                if (point.x <= 0) {
                  point.x = 0;
                }

                if (point.y <= 0) {
                  point.y = 0;
                }

                if (point.x >= this.width) {
                  point.x = this.width;
                }

                if (point.y >= this.height) {
                  point.y = this.height;
                }
                break;
              default:
                break;
            }
          })
          .on("end", (d) => {
            d3.event.sourceEvent.stopPropagation();
            this.selectedItem.type === "rect" && this.rectLimit();
          })
          .filter((e) => !this.readOnly)
      );
    },

    rectLimit() {
      if (this.selectedItem.x <= 0) {
        this.selectedItem.x = 0;
      }

      if (this.selectedItem.y <= 0) {
        this.selectedItem.y = 0;
      }

      if (this.selectedItem.width > this.width) {
        this.selectedItem.width = this.width;
      }

      if (this.selectedItem.height > this.height) {
        this.selectedItem.height = this.height;
      }

      if (this.selectedItem.x + this.selectedItem.width >= this.width) {
        this.selectedItem.x = this.width - this.selectedItem.width;
      }

      if (this.selectedItem.y + this.selectedItem.height >= this.height) {
        this.selectedItem.y = this.height - this.selectedItem.height;
      }
    },

    initRectDragEvent() {
      d3.selectAll("rect.rect").call(
        d3
          .drag()
          .on("start", (e) => {
            this.resetMenuData();

            d3.event.sourceEvent.stopPropagation();
            // this.selectedItem = this.regionList.find(item => item.id === d3.event.sourceEvent.target.id)
          })
          .on("drag", (e) => {
            d3.event.sourceEvent.stopPropagation();
            const { dx, dy } = d3.event;

            this.selectedItem.x += dx;
            this.selectedItem.y += dy;

            this.rectLimit();
          })
          .on("end", (e) => {
            d3.event.sourceEvent.stopPropagation();
          })
          .filter((e) => !this.readOnly)
      );
    },

    initPolygonDragEvent() {
      d3.selectAll("polygon.polygon").call(
        d3
          .drag()
          .on("start", (e) => {
            this.resetMenuData();

            d3.event.sourceEvent.stopPropagation();
            // this.selectedItem = this.regionList.find(item => item.id === d3.event.sourceEvent.target.id)
          })
          .on("drag", (e) => {
            d3.event.sourceEvent.stopPropagation();
            const { dx, dy } = d3.event;

            const length = this.selectedItem.points.length;

            let xMove = true;
            let yMove = true;

            for (let i = 0; i < length; i++) {
              const { x, y } = this.selectedItem.points[i];
              if (x + dx < 0 || x + dx > this.width) {
                xMove = false;
              }
              if (y + dy < 0 || y + dy > this.height) {
                yMove = false;
              }
            }

            this.selectedItem.points = this.selectedItem.points.map(
              ({ x, y, ...other }) => ({
                x: xMove ? x + dx : x,
                y: yMove ? y + dy : y,
                ...other,
              })
            );
          })
          .on("end", (e) => {
            d3.event.sourceEvent.stopPropagation();
          })
          .filter((e) => !this.readOnly)
      );
    },

    handleRegionMetaMouseIn(index) {
      this.hoverIndex = index;
    },

    handleRegionMetaMouseLeave(index) {
      this.hoverIndex = -1;
    },

    initKeyEvents() {
      window.addEventListener("keydown", (e) => {
        const { ctrlKey, metaKey } = e;
        switch (true) {
          case ctrlKey:
            this.ctrlKeyDown = true;
            break;
          case metaKey:
            this.ctrlKeyDown = true;
            break;
          default:
            break;
        }
      });

      window.addEventListener("keyup", (e) => {
        const { ctrlKey, metaKey, key } = e;

        if (!ctrlKey && !metaKey) {
          this.ctrlKeyDown = false;
        }

        switch (true) {
          case key === "e":
            this.actionType = enumActionType.drawPolygon;
            break;
          case key === "r":
            this.actionType = enumActionType.drawRect;
            break;
          case key === "m":
            this.actionType = enumActionType.move;
            break;
          default:
            break;
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.main {
  box-sizing: border-box;
  padding: 10px 20px 20px;
  height: 100%;
  min-height: 700px;
}
.header {
  padding: 20px 0 50px;
  .header-title {
    font-size: 20px;
  }
  .icon-helper {
    font-size: 28px;
  }
}
.target-img {
  width: 100%;
  /*max-height: 100%;*/
}
.content-canvas {
  background: #eee;
  border-radius: 3px 0 3px 3px;
  max-height: 1000px;
}
.panel-right {
  width: 40%;
  max-height: 100%;
  overflow: scroll;
  padding-left: 15px;
}

.rect {
  &.hover {
    fill: rgba(42, 214, 81, 0.5294117647058824);
    stroke: rgb(42, 214, 81);
  }
  &.active {
    stroke-dasharray: 15, 10;
    animation: animation-dash 10s linear forwards infinite;
    stroke-dashoffset: 500px;
  }
}

@keyframes animation-dash {
  0% {
    stroke-dashoffset: 500px;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.polygon {
  &.hover {
    fill: rgba(42, 214, 81, 0.5294117647058824);
    stroke: rgb(42, 214, 81);
  }
  &.active {
    stroke-dasharray: 15, 10;
    animation: animation-dash 10s linear forwards infinite;
    stroke-dashoffset: 500px;
  }
}

.mark-svg {
  width: 100%;
  height: 100%;

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;

  &.action-0 {
    cursor: move;
  }

  &.action-1 {
    cursor: move;
  }

  &.action-2 {
    cursor: move;
    image {
      cursor: crosshair;
    }
    .ctrl-key-down {
      image {
        cursor: move;
      }
    }
  }

  &.action-3 {
    cursor: move;
    image {
      cursor: crosshair;
    }
    .ctrl-key-down {
      image {
        cursor: move;
      }
    }
  }

  circle.point {
    stroke-width: 6px;
    cursor: crosshair;

    fill: rgba(255, 255, 255, 0.7);

    stroke: transparent;

    &.spec {
      cursor: auto;

      pointer-events: none;
    }
    &.point-control {
      cursor: default;
      &-tl {
        cursor: se-resize;
      }
      &-tm {
        cursor: n-resize;
      }
      &-tr {
        cursor: ne-resize;
      }
      &-ml {
        cursor: w-resize;
      }
      &-mr {
        cursor: e-resize;
      }
      &-bl {
        cursor: ne-resize;
      }
      &-bm {
        cursor: s-resize;
      }
      &-br {
        cursor: nw-resize;
      }
    }
  }

  .polyline {
    &:hover {
      cursor: pointer;
      stroke: rgba(41, 255, 41, 0.48);
    }
  }
}

.menu {
  background: #fff;
  border-radius: 3px;
  width: 120px;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
}
.menu-item {
  padding: 0 15px;
  height: 36px;
  line-height: 36px;
  cursor: pointer;
  user-select: none;
}
.ml-15 {
  margin-left: 15px;
}
.label-title {
  padding-bottom: 20px;
  padding-right: 16px;
  line-height: 30px;
  font-size: 16px;
}
.content-region-list {
  .item {
    padding: 10px 15px 10px 0;
    border: 1px solid transparent;
    border-bottom-color: #eee;
    &:hover,
    &.hover {
      background: #f4f4f4;
    }
    &.active {
      background: #f1f8ff;
      /*border-color: #a7cbf4;*/
      border-radius: 3px;
    }
  }
  .field-index {
    box-sizing: border-box;
    padding-left: 10px;
    width: 40px;
  }
  .field-type {
    width: 50px;
  }
}

.icon-enlarge,
.icon-shrink,
.icon-reset,
.icon-adjust-screen {
  width: 24px;
  height: 24px;
  margin: 0 5px;

  fill: #777;

  cursor: pointer;
}

.tool-container {
  padding: 4px 4px 0 2px;
  left: -144px;
  top: -35px;
  border: 1px solid #eee;
  border-radius: 3px 3px 0 0;
  border-bottom: none;
}

.type-select-container {
  top: 80px;
  right: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.8);
}
</style>

<style lang="less">
.ivu-radio-group-vertical .ivu-radio-wrapper.action-type-radio {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 48px;
  padding: 5px 8px 0;
  box-sizing: border-box;
  margin-right: 0;

  &.ivu-radio-wrapper-checked {
    background: #c3ffd5;
  }
}
.action-type-radio {
  .ivu-radio {
    display: none;
  }
  .ivu-icon {
    font-size: 16px;
  }
}

.empty-tip {
  padding-top: 10px;
  color: #999;
}

.helper-title {
  padding: 12px 0 8px;
  &:first-child {
    padding-top: 6px;
  }
}
.helper-list {
  padding-left: 2em;
  line-height: 26px;
  li {
    list-style: initial;
  }
}

.icon-trash {
  margin-left: 15px;
  height: 20px;
  font-size: 20px;
  cursor: pointer;
  &:hover {
    color: #ff4500;
  }
}

.ivu-tooltip-rel {
  width: 100%;
}
.ivu-tooltip-inner {
  white-space: normal;
}
</style>
