import React from "react";
import {SectionTab} from "polotno/side-panel";
import BsFillGrid3X3GapFill from "@meronex/icons/bs/BsFillGrid3X3GapFill";
import {observer} from "mobx-react-lite";
import * as svg from "polotno/utils/svg";
import {NumericInput, Switch, Alignment} from "@blueprintjs/core";

function createDot(x, y, store) {
    const template = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"></svg>`;
    const url = svg.svgToURL(template);
    store.activePage.addElement({
        x,
        y,
        type: "svg",
        width: 1,
        height: 1,
        src: url,
        name: "grid",
        selectable: false
    });
}

function clearGrid(store) {
    const gridElements = store.activePage.children.filter((child) => child.name === "grid");
    const ids = gridElements.map((el) => el.id);
    store.deleteElements(ids);
}

function generateGrid(rows, cols, store) {
    clearGrid(store);
    const {width, height} = store;
    const dx = width / rows;
    const dy = width / cols;
    // generate svg data for grid image
    const template = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      ${[...Array(rows - 1)]
          .map(
              (_, index) =>
                  `<line x1="${dx * (index + 1)}" y1="0" x2="${
                      dx * (index + 1)
                  }" y2="${height}" stroke="blue" stroke-width="2"/>`
          )
          .join("")}
        ${[...Array(cols - 1)]
            .map(
                (_, index) =>
                    `<line x1="0" y1="${dy * (index + 1)}" x2="${width}" y2="${
                        dy * (index + 1)
                    }" stroke="blue" stroke-width="2"/>`
            )
            .join("")}
    </svg>`;

    // add grid image into the page
    const url = svg.svgToURL(template);
    store.activePage.addElement({
        type: "svg",
        width,
        height,
        src: url,
        name: "grid",
        selectable: false,
        opacity: 0.2,
        alwaysOnTop: true,
        showInExport: false
    });

    // add fake elemtns to snap on grid
    [...Array(rows - 1)].forEach((_, index) => {
        createDot(dx * (index + 1), 0, store);
    });
    [...Array(cols - 1)].forEach((_, index) => {
        createDot(0, dy * (index + 1), store);
    });
}

export const GridSection = {
    name: "grid",
    Tab: (props) => (
        <SectionTab name="Grid" {...props}>
            <BsFillGrid3X3GapFill />
        </SectionTab>
    ),
    // we need observer to update component automatically on any store changes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Panel: observer(({store}: any) => {
        const [visible, setVisible] = React.useState(true);
        const [rows, setRows] = React.useState(5);
        const [cols, setCols] = React.useState(5);
        React.useEffect(() => {
            if (!visible) {
                clearGrid(store);
            } else {
                generateGrid(rows, cols, store);
            }
        }, [rows, cols, visible, store]);
        return (
            <div>
                <div>
                    <Switch
                        checked={visible}
                        onChange={(val) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const currentChecked = val.target as any;
                            setVisible(currentChecked.checked);
                        }}
                        alignIndicator={Alignment.RIGHT}
                        style={{
                            marginTop: "8px",
                            marginBottom: "25px"
                        }}
                    >
                        Show grid
                    </Switch>
                    <div style={{width: "50%", display: "inline-block"}}>Rows:</div>
                    <div style={{width: "50%", display: "inline-block"}}>
                        <NumericInput
                            fill
                            value={rows}
                            onValueChange={(currentRows) => {
                                setRows(currentRows || 1);
                            }}
                            min={1}
                            max={100}
                            selectAllOnFocus
                        />
                    </div>
                </div>
                <div style={{paddingTop: "10px"}}>
                    <div style={{width: "50%", display: "inline-block"}}>Cols:</div>
                    <div style={{width: "50%", display: "inline-block"}}>
                        <NumericInput
                            fill
                            value={cols}
                            onValueChange={(currentCols) => {
                                setCols(currentCols || 1);
                            }}
                            min={1}
                            max={100}
                            selectAllOnFocus
                        />
                    </div>
                </div>
            </div>
        );
    })
};
