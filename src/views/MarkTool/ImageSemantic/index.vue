<template>
  <div class="main flex flex-column">
    <div class="header flex justify-between items-center">
      <p class="header-title">语义分割</p>
      <Icon
        class="icon-helper"
        @click="drawerShow = true"
        type="ios-help-circle"
      />
      <Drawer
        :width="350"
        title="语义分割标注工具帮助"
        :closable="false"
        v-model="drawerShow"
      >
        <!-- <p class="helper-title fs-16">支持功能</p>
        <ul class="helper-list fs-14">
          <li>画布拖拽/缩放</li>
          <li>矩形/多边形大小位置调整</li>
          <li>多边形快捷添加/删除顶点</li>
          <li>区域列表与显示联动</li>
        </ul> -->
        <p class="helper-title fs-16">操作与快捷键说明</p>
        <ul class="helper-list fs-14">
          <li>鼠标拖拽画布、区域、顶点</li>
          <li>鼠标滚轮画布缩放</li>
          <li>
            点击圆形按钮绘制 --
            <span class="text-danger">快捷键T</span>
          </li>
          <li>
            点击椭圆形按钮绘制 --
            <span class="text-danger">快捷键Y</span>
          </li>
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
          <!-- <li>
            上一张 --
            <span class="text-danger">快捷键Q</span>
          </li>
          <li>
            下一张 --
            <span class="text-danger">快捷键Z</span>
          </li> -->
          <li>
            删除图形 --
            <span class="text-danger">快捷键Delete</span>
          </li>

          <li>
            绘制多边形时图片上移 --
            <span class="text-danger">快捷键W</span>
          </li>
          <li>
            绘制多边形时图片下移 --
            <span class="text-danger">快捷键S</span>
          </li>
          <li>
            绘制多边形时图片左移 --
            <span class="text-danger">快捷键A</span>
          </li>
          <li>
            绘制多边形时图片右移 --
            <span class="text-danger">快捷键D</span>
          </li>
          <li>
            点击选择多个图形 --
            <span class="text-danger">长按Ctrl</span>
          </li>
          <li>
            绘制时按
            <span class="text-danger">Shift键</span>可拖拽/缩放画布
          </li>

          <li>右击画布完成多边形绘制</li>
          <li>点击多边形边可添加顶点</li>
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
            <Radio
              :disabled="!isMultiple && activeTags.length != 1"
              :label="4"
              class="action-type-radio"
            >
              <Icon type="ios-radio-button-off" />
              <span>圆形</span>
            </Radio>
            <Radio
              :disabled="!isMultiple && activeTags.length != 1"
              :label="5"
              class="action-type-radio"
            >
              <svg
                t="1600238177802"
                class="icon"
                viewBox="0 0 1373 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="10693"
                width="20"
                height="20"
              >
                <path
                  stroke-width="0.5"
                  style="fill: #333; opacity: 0.5; transform: scale(0.9)"
                  d="M686.397214 1.139911c-378.457184 0-685.257304 228.720798-685.257304 510.860089 0 282.141572 306.800119 510.860089 685.257304 510.860089 378.459464 0 685.257304-228.718518 685.257304-510.860089C1371.654518 229.860708 1064.856678 1.139911 686.397214 1.139911zM686.397214 974.986121c-342.990004 0-621.041576-207.285917-621.041576-462.986121 0-255.700203 278.049292-462.986121 621.041576-462.986121 342.992283 0 621.039296 207.285917 621.039296 462.986121C1307.43651 767.700203 1029.389498 974.986121 686.397214 974.986121z"
                  p-id="10694"
                />
              </svg>
              <span>椭圆</span>
            </Radio>
            <Radio
              :disabled="!isMultiple && activeTags.length != 1"
              :label="2"
              class="action-type-radio"
            >
              <Icon type="ios-square-outline" />
              <span>矩形</span>
            </Radio>
            <Radio
              :disabled="!isMultiple && activeTags.length != 1"
              :label="3"
              class="action-type-radio"
            >
              <Icon type="ios-star-outline" />
              <span>多边形</span>
            </Radio>
            <Radio :label="0" class="action-type-radio">
              <Icon type="ios-move" />
              <span>移动</span>
            </Radio>
          </RadioGroup>
        </div>
        <div class="tool-container absolute flex z-999">
          <Tooltip
            class="icon-enlarge"
            style="margin-right: 0px"
            content="调整透明度"
            placement="top"
          >
            <Icon @click="changeOpacity" type="ios-options-outline" />
          </Tooltip>
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
              @click="resetAdjustScreen"
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

              <path
                d="M65.000,66.000 L66.000,66.000 L66.000,1.000 L65.000,1.000 L65.000,66.000 Z"
              />
              <path
                d="M66.000,66.000 L66.000,65.000 L1.000,65.000 L1.000,66.000 L66.000,66.000 Z"
              />

              <path
                d="M117.000,66.000 L116.000,66.000 L116.000,1.000 L117.000,1.000 L117.000,66.000 Z"
              />
              <path
                d="M116.000,66.000 L116.000,65.000 L181.000,65.000 L181.000,66.000 L116.000,66.000 Z"
              />

              <circle cx="91" cy="87" r="18" fill="#555" />
            </svg>
          </Tooltip>
          <Tooltip transfer content="原始大小" placement="top">
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
        <!-- <img class="target-img" :src="monaLisa" /> -->
        <svg
          class="J_mark_svg mark-svg"
          :class="`action-${actionType}`"
          @contextmenu="svgContextMenu"
        >
          <g
            ref="area"
            class="J_mark"
            v-if="resource_url"
            :class="{ 'ctrl-key-down': shiftKeyDown }"
            @click="handleMarkAreaClick"
            @mousemove="handleMarkAreaMouseMove"
            @contextmenu="handleMarkAreaContextMenu"
          >
            <image
              id="mark-img"
              v-show="width"
              :width="width"
              :height="height"
              :xlink:href="resource_url"
            />
            <g class="regions-container">
              <g
                class="region"
                v-for="(item, index) in regionList"
                :key="index"
              >
                <CircleTool
                  v-if="item.type === 'circle' || item.type === 'ellipse'"
                  :svgData="item"
                  :index="index"
                  :hover="hoverIndex === index"
                  :active="selectedItemIdArr.includes(item.id)"
                  @handleRegionMetaMouseIn="handleRegionMetaMouseIn"
                  @handleRegionMetaMouseLeave="handleRegionMetaMouseLeave"
                  @on-mouse-down="handleRegionClick"
                  @on-handle-stop-propagation="handleStopPropagation"
                ></CircleTool>
                <!-- 正方形 -->
                <rect
                  class="rect"
                  :class="{
                    hover: hoverIndex === index,
                    active: selectedItemIdArr.includes(item.id),
                  }"
                  v-if="item.type === 'rect'"
                  :x="item.x"
                  :y="item.y"
                  :width="item.width"
                  :height="item.height"
                  fill="rgba(94, 158, 224, 1)"
                  :style="{ opacity: item.opacity }"
                  stroke="#6da1ff"
                  stroke-width="1"
                  @mousedown="handleRegionClick(item.id, $event)"
                  @click="handleStopPropagation"
                  @contextmenu="handleRegionContextMenu($event)"
                  @mouseenter="handleRegionMetaMouseIn(index)"
                  @mouseleave="handleRegionMetaMouseLeave(index)"
                />

                <polygon
                  class="polygon"
                  :class="{
                    hover: hoverIndex === index,
                    active: selectedItemIdArr.includes(item.id),
                  }"
                  v-if="item.type === 'polygon'"
                  stroke="#6da1ff"
                  stroke-width="1"
                  fill="rgba(94, 158, 224, 1)"
                  :style="{ opacity: item.opacity }"
                  :points="getPolygonPoints(item)"
                  @mousedown="handleRegionClick(item.id, $event)"
                  @click="handleStopPropagation"
                  @contextmenu="handleRegionContextMenu($event)"
                  @mouseenter="handleRegionMetaMouseIn(index)"
                  @mouseleave="handleRegionMetaMouseLeave(index)"
                />
                <g v-if="item.type === 'polygon'">
                  <!-- 多边形跟踪线段选中后 -->
                  <line
                    class="polyline"
                    v-for="(lp, lpIndex) in item.points"
                    :key="lpIndex"
                    stroke="transparent"
                    stroke-width="10"
                    fill="none"
                    @click="handlePolyLine(item, lpIndex, $event)"
                    :x1="lp.x"
                    :y1="lp.y"
                    :x2="
                      lpIndex === item.points.length - 1
                        ? item.points[0].x
                        : item.points[lpIndex + 1].x
                    "
                    :y2="
                      lpIndex === item.points.length - 1
                        ? item.points[0].y
                        : item.points[lpIndex + 1].y
                    "
                  />
                </g>
              </g>
            </g>
            <GraphMaking
              :pointMove="pointMove"
              :currentDraw="currentDraw"
              @handleMarkAreaContextMenu="handleMarkAreaContextMenu"
            ></GraphMaking>
            <SelectedPoint
              :initPointDrag="initPointDrag"
              :getSelectItemFn="getSelectItemFn"
              :selectedItemIdArr="selectedItemIdArr"
              :selectedItem="selectedItem"
              @handlePolygonPointContextMenu="handlePolygonPointContextMenu"
            ></SelectedPoint>
          </g>
        </svg>
      </div>
      <div class="panel-right relative">
        <div class="h-100 flex flex-column">
          <Card style="margin-bottom: 20px">
            <div slot="title" class="flex items-center justify-between">
              <span> 标签列表 </span>
              <Tooltip
                v-if="!readOnly"
                transfer
                content="清空选中"
                placement="top"
              >
                <Icon
                  @click="clearActiveTags"
                  class="pointer"
                  :size="18"
                  type="ios-trash-outline"
                />
              </Tooltip>
            </div>
            <div class="clearfix">
              <Button
                style="float: left; margin-right: 10px; margin-bottom: 5px"
                v-for="(item, index) in tagList"
                @click="selectTagList(item)"
                :key="index"
                type="success"
                shape="circle"
                :ghost="!activeTags.includes(item)"
                >{{ item }}</Button
              >
            </div>
          </Card>
          <Card>
            <div slot="title" class="flex items-center justify-between">
              <span> 标签 </span>
              <Tooltip v-if="!readOnly" transfer content="删除" placement="top">
                <Icon
                  @click="deleteRegionList"
                  class="pointer"
                  :size="18"
                  type="ios-trash-outline"
                />
              </Tooltip>
            </div>
            <div>
              <ul class="content-region-list overflow-auto">
                <li
                  class="item"
                  :class="{
                    hover: hoverIndex === index,
                    active: selectedItemIdArr.includes(item.id),
                  }"
                  v-for="(item, index) in regionList"
                  :key="item.id"
                  @mouseenter="handleRegionMetaMouseIn(index)"
                  @mouseleave="handleRegionMetaMouseLeave(index)"
                  @click="handleRegionSelect(item.id)"
                >
                  <div class="flex items-center">
                    <div
                      class="flex items-center"
                      style="width: 100px; padding-left: 10px"
                    >
                      <Checkbox
                        :value="selectedItemIdArr.includes(item.id)"
                      ></Checkbox>
                      <p
                        style="padding-top: 3px; text-align: left"
                        class="ellipsis"
                      >
                        {{ typeMap[item.type] }}
                      </p>
                    </div>
                    <Select
                      :disabled="readOnly"
                      class="flex-grow-1"
                      :multiple="isMultiple"
                      v-model="item.tags"
                      @on-change="tagsSelectChange"
                      @click.native="handleStopPropagation"
                    >
                      <Option
                        v-for="item in tagList"
                        :value="item"
                        :key="item"
                        >{{ item }}</Option
                      >
                    </Select>
                  </div>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
    <Modal v-model="opacityModel" title="调整透明度">
      <div class="flex items-center">
        <Slider
          :tip-format="format"
          @on-change="changeOpacityTool"
          style="width: 90%; margin-right: 20px"
          show-tip="always"
          v-model="opacityCurValue"
        ></Slider>
        {{ opacityCurValue }}%
      </div>
    </Modal>
  </div>
</template>

<script>
import * as d3 from "d3";
import monaLisa from "@/assets/img/test.jpeg";
import { randomString } from "@/libs/tool";
import initScreen from "./initSvg";
import initEvent from "./initEvent";
import CircleTool from "./CircleTool";
import SelectedPoint from "./SelectedPoint";
import GraphMaking from "./GraphMaking";
// tip 在 SVG 文档中的1个像素对应输出设备（比如显示屏）上的1个像素

// 计算 offset 数值，如果传入了 ele 参数，则计算基于该 ele 的 offset
const getOffset = (e, ele) => {
  const evt = e || window.event;

  const srcObj = ele || evt.target || evt.srcElement;

  return {
    offsetX: evt.clientX - srcObj.getBoundingClientRect().left, // 返回元素的大小及其相对于视口的位置
    offsetY: evt.clientY - srcObj.getBoundingClientRect().top, // 点击位置距离当前body可视区域的x，y坐标
  };
};

const isArray = (o) => Object.prototype.toString.call(o) === "[object Array]";

const enumActionType = {
  move: 0,
  select: 1,
  drawRect: 2,
  drawPolygon: 3,
  drawCircle: 4,
  drawEllipse: 5,
};

export default {
  name: "Main",
  mixins: [initScreen, initEvent],
  components: {
    CircleTool,
    SelectedPoint,
    GraphMaking,
  },
  data() {
    return {
      moveDirection: "",
      readOnly: false,
      opacityModel: false,
      opacityCurValue: 0,
      resource_url: "",
      ready: false,
      circleRadius: 4, // 操作点半径
      drawerShow: false,
      regionList: [],
      menuData: {
        show: false,
        x: 0,
        y: 0,
      },
      currentDraw: null,
      selectedItem: null,
      pointMove: null,
      hoverIndex: -1,
      isMultiple: false,
      tagList: [],
      activeTags: [],
      typeMap: {
        rect: "矩形",
        circle: "圆形",
        polygon: "多边形",
        ellipse: "椭圆",
      },
      selectedItemIdArr: [],
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

    this.initDragEvent();

    this.initKeyEvents();

    this.handleNext();
  },

  watch: {
    selectedItem() {
      this.initPointDrag();
    },
    actionType() {
      this.removeCurrentPoloy();
    },
  },

  methods: {
    format(val) {
      return null;
    },
    changeOpacity() {
      if (this.selectedItemIdArr.length === 0) {
        this.$Message.info("请选择要更改的元素");
        return;
      }
      if (this.selectedItemIdArr.length > 1) {
        this.$Message.info("只能选择单个元素进行更改");
        return;
      }
      const selectItem = this.getSelectItemFn(this.selectedItemIdArr);
      this.opacityCurValue = selectItem[0].opacity * 100;
      this.opacityModel = true;
    },
    changeOpacityTool(val) {
      const selectItem = this.getSelectItemFn(this.selectedItemIdArr);
      selectItem[0].opacity = val / 100;
    },
    removeCurrentPoloy() {
      if (this.currentDraw && this.currentDraw.type === "polygon") {
        this.currentDraw = null;
      }
    },
    initPointDrag() {
      this.$nextTick(() => {
        this.initPointsDragEvent();
        this.initEllipsePointsDragEvent();
        this.initCirclePointsDragEvent();
        this.initPolygonPointsDragEvent();
      });
    },
    /**
     * 点击画布图形区域
     */
    handleRegionClick(id, e) {
      e.stopPropagation();
      // 拖动区域
      if (!this.selectedItem || this.selectedItem.id !== id) {
        this.selectedItem = this.regionList.find((item) => item.id === id);
      }

      if (
        this.selectedItemIdArr.length === 0 ||
        window.event.ctrlKey ||
        window.event.metaKey
      ) {
        // 选中区域
        const index = this.selectedItemIdArr.indexOf(id);
        index === -1 && this.selectedItemIdArr.push(id);
        this.setActiveTagsBySelectedItem();
      }
    },
    getTargetTag(tag, index) {
      const tagIndex = this.regionList[index].tags.findIndex(
        (item) => item.tag === tag
      );
      return this.regionList[index].tags[tagIndex];
    },
    selectTagList(type) {
      const i = this.activeTags.indexOf(type);
      if (i === -1) {
        this.activeTags.push(type);
      } else {
        this.activeTags.splice(i, 1);
      }
      if (this.activeTags.length !== 1) {
        this.actionType = 0;
      }
      this.removeCurrentPoloy();
      this.filterSelectItems();
    },
    // 设置相应的选中项
    filterSelectItems() {
      this.selectedItemIdArr = [];
      if (this.activeTags.length === 0) {
        this.selectedItemIdArr = [];
      } else {
        this.regionList.forEach((item) => {
          if (!this.isMultiple) {
            if (this.activeTags.includes(item.tags)) {
              this.selectedItemIdArr.push(item.id);
            }
          } else {
            for (const value of this.activeTags) {
              if (item.tags.includes(value)) {
                this.selectedItemIdArr.push(item.id);
              }
            }
          }
        });
      }
    },
    setActiveTagsBySelectedItem() {
      const selectedItems = this.getSelectItemFn(this.selectedItemIdArr);
      this.activeTags = [];
      selectedItems.forEach((item) => {
        if (this.isMultiple) {
          item.tags.forEach((tags) => {
            if (!this.activeTags.includes(tags)) {
              this.activeTags.push(tags);
            }
          });
        } else {
          if (!this.activeTags.includes(item.tags)) {
            this.activeTags.push(item.tags);
          }
        }
      });
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
              type: "rect",
              opacity: 0.8,
              width: 350.2183532714844,
              x: 290.8309631347656,
              y: 148.2675018310547,
              tags: "1",
            },
            {
              height: 311.873291015625,
              type: "rect",
              opacity: 0.8,
              width: 278.6408996582031,
              x: 301.0563049316406,
              y: 677.4295043945312,
              tags: "1",
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
      this.tagList = this.getTagListFromMarkTags(mark_tags);
      this.width = 0;
      this.height = 0;
      this.resource_url = resource_url;
      this.initImage(mark_result);
    },

    // 根据mark_tags获得标签值列表
    getTagListFromMarkTags(markTags) {
      let res = [];
      markTags.forEach(({ tagTypeList }) => {
        res = [...res, ...tagTypeList];
      });
      return [...new Set(res)];
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

    handlePolygonPointContextMenu(item, index, e) {
      e.preventDefault();
      e.stopPropagation();
      item.points.splice(index, 1);
      const regionIndex = this.regionList.findIndex(
        (region) => region.id === item.id
      );
      this.regionList.splice(regionIndex, 1, item);
      if (item.points.length < 3) {
        const i = this.selectedItemIdArr.findIndex(
          (itemId) => itemId === item.id
        );
        this.selectedItemIdArr.splice(i, 1);
        this.regionList.splice(regionIndex, 1);
        this.getSelectItemFn(this.selectedItemIdArr);
        this.selectedItem = null;
      }
      return false;
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
      if (
        this.actionType !== enumActionType.drawPolygon ||
        !this.currentDraw ||
        !this.currentDraw.points.length ||
        this.shiftKeyDown
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
          const id = randomString(8);
          const tagValue = this.activeTags[0];
          this.regionList = [
            ...this.regionList,
            {
              id: id,
              type: "polygon",
              points: this.currentDraw.points,
              opacity: 0.8,
              tags: this.isMultiple ? [...this.activeTags] : tagValue,
            },
          ];
          this.selectedItemIdArr.push(id);
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

    handlePolyLine(item, lpIndex, e) {
      e.stopPropagation();

      if (this.readOnly) {
        return;
      }

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
        this.initPolygonDragEvent();
        this.initPolygonPointsDragEvent();
      });
    },

    handleStopPropagation(e) {
      e.stopPropagation();
    },

    handleRegionSelect(id) {
      const index = this.selectedItemIdArr.indexOf(id);
      index === -1
        ? this.selectedItemIdArr.push(id)
        : this.selectedItemIdArr.splice(index, 1);
      if (!this.selectedItem || this.selectedItem.id !== id) {
        this.selectedItem = this.regionList.find((item) => item.id === id);
      }
      this.setActiveTagsBySelectedItem();
    },
    tagsSelectChange(value) {
      this.setActiveTagsBySelectedItem();
    },
    getSelectItemFn(arr) {
      return this.regionList.filter((item) => {
        return arr.includes(item.id);
      });
    },
    deleteRegionList() {
      for (let i = 0; i < this.regionList.length; i++) {
        if (this.selectedItemIdArr.includes(this.regionList[i].id)) {
          const index = this.selectedItemIdArr.findIndex(
            (id) => id === this.regionList[i].id
          );
          this.selectedItemIdArr.splice(index, 1);
          this.regionList.splice(i, 1);
          --i;
        }
      }
    },
    clearActiveTags() {
      this.activeTags = [];
      this.selectedItemIdArr = [];
    },

    handleRegionMetaMouseIn(index) {
      this.hoverIndex = index;
    },

    handleRegionMetaMouseLeave(index) {
      this.hoverIndex = -1;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.main {
  box-sizing: border-box;
  padding: 10px 20px 20px;
  height: 100%;
  min-height: 600px;
}
.header {
  padding: 20px 0 20px;
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
  overflow: auto;
  padding-left: 15px;
}

.rect,
.polygon,
.circle,
.ellipse {
  &.hover {
    fill: rgba(42, 214, 81, 1);
    stroke: rgb(42, 214, 81);
  }
  &.active {
    stroke-dasharray: 15, 10;
    animation: animation-dash 10s linear forwards infinite;
    stroke-dashoffset: 500px;
    fill: rgba(42, 214, 81, 1);
    stroke: rgb(42, 214, 81);
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
  &.action-4 {
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
  &.action-5 {
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
  z-index: 999;
  padding: 4px 4px 0 2px;
  right: 6px;
  top: 15px;
  border: 1px solid #eee;
  border-radius: 3px 3px 0 0;
  border-bottom: none;
  background: rgba(255, 255, 255, 0.8);
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
