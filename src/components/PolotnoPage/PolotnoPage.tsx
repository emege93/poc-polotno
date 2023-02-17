import React from "react";
import {PolotnoContainer, SidePanelWrap, WorkspaceWrap} from "polotno";
import {Toolbar} from "polotno/toolbar/toolbar";
import {ZoomButtons} from "polotno/toolbar/zoom-buttons";
import {SidePanel} from "polotno/side-panel";
import {Workspace} from "polotno/canvas/workspace";

import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import createStore from "polotno/model/store";

const store = createStore({
    key: "nFA5H9elEytDyPyvKL7T", // you can create it here: https://polotno.com/cabinet/
    // you can hide back-link on a paid license
    // but it will be good if you can keep it for Polotno project support
    showCredit: true
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const page = store.addPage();

const PolotnoPage = (): React.ReactElement => {
    return (
        <PolotnoContainer style={{width: "100vw", height: "100vh"}}>
            <SidePanelWrap>
                <SidePanel store={store} />
            </SidePanelWrap>
            <WorkspaceWrap>
                <Toolbar store={store} downloadButtonEnabled />
                <Workspace store={store} />
                <ZoomButtons store={store} />
            </WorkspaceWrap>
        </PolotnoContainer>
    );
};

export default PolotnoPage;
