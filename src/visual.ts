"use strict";
import "@babel/polyfill";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import { VisualSettings } from "./settings";

import * as d3 from "d3";

export interface TestItem {
  Country: string;
  Amount: number;
}

export class Visual implements IVisual {
  private target: HTMLElement;
  private updateCount: number;
  private settings: VisualSettings;
  private textNode: Text;

  private svg: d3.Selection<SVGElement, {}, HTMLElement, any>;
  private container: d3.Selection<SVGElement, {}, HTMLElement, any>;
  private rect: d3.Selection<SVGElement, {}, HTMLElement, any>;
  private textValue: d3.Selection<SVGElement, {}, HTMLElement, any>;
  private textLabel: d3.Selection<SVGElement, {}, HTMLElement, any>;
  private margin = { top: 20, right: 20, bottom: 200, left: 70 };

  constructor(options: VisualConstructorOptions) {
    this.svg = d3
      .select(options.element)
      .append("svg")
      .classed("rectCard", true);
    this.container = this.svg.append("g").classed("container", true);
    this.rect = this.container.append("rect").classed("rect", true);
    this.textValue = this.container.append("text").classed("textValue", true);
    this.textLabel = this.container.append("text").classed("textLabel", true);
  }

  public update(options: VisualUpdateOptions) {
    let width: number = options.viewport.width;
    let height: number = options.viewport.height;
    this.svg.attr("width", width);
    this.svg.attr("height", height);
    let x: number = 100;
    let y: number = 100
    this.rect
      .style("fill", "white")
      .style("fill-opacity", 0.5)
      .style("stroke", "black")
      .style("stroke-width", 2)
      .attr("x", x).attr("y", y).attr("width", 80).attr("height", 20)
    let fontSizeValue: number = Math.min(width, height) / 5;
    this.textValue
      .text("Value")
      .attr("x", "50%").attr("y", "50%").attr("dy", "0.35em").attr("text-anchor", "middle")
      .style("font-size", fontSizeValue + "px");
    let fontSizeLabel: number = fontSizeValue / 4;
    this.textLabel
      .text("Label")
      .attr("x", "50%").attr("y", height/2).attr("dy", fontSizeValue/1.2).attr("text-anchor", "middle")
      .style("font-size", fontSizeLabel + "px");
  }

  private static parseSettings(dataView: DataView): VisualSettings {
    return VisualSettings.parse(dataView) as VisualSettings;
  }

  public static converter(options: VisualUpdateOptions): TestItem[] {
    let rows = options.dataViews[0].table.rows;
    let resultData: TestItem[] = [];
    //convert from ['x', y] to [{"x":x, "y": y}]
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      resultData.push({
        Country: row[0].toString(),
        Amount: +row[1]
      });
    }
    return resultData;
  }

  /**
   * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
   * objects and properties you want to expose to the users in the property pane.
   *
   */
  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
    return VisualSettings.enumerateObjectInstances(
      this.settings || VisualSettings.getDefault(),
      options
    );
  }
}
