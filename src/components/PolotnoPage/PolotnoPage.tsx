import React from "react";
import {PolotnoContainer, SidePanelWrap, WorkspaceWrap} from "polotno";
import {Toolbar} from "polotno/toolbar/toolbar";
import {ZoomButtons} from "polotno/toolbar/zoom-buttons";
import {SectionTab, SidePanel} from "polotno/side-panel";
import {Workspace} from "polotno/canvas/workspace";

import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import createStore from "polotno/model/store";
import {getSvg, loadStore} from "./store";
import {Button} from "@blueprintjs/core";
import {observer} from "mobx-react-lite";
import {DEFAULT_SECTIONS} from "polotno/side-panel";
import {TemplatesSection} from "components/templates-panel";
import {UploadPanel} from "components/UploadPanel";
import {GridSection} from "components/Grid";

const store = createStore({
    key: "nFA5H9elEytDyPyvKL7T", // you can create it here: https://polotno.com/cabinet/
    // you can hide back-link on a paid license
    // but it will be good if you can keep it for Polotno project support
    showCredit: true
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const page = store.addPage();

const getStoreJson = () => {
    return store.toJSON();
};

const loadStoreToJson = () => {
    return store.loadJSON(loadStore);
};

const addElement = () => {
    store.activePage?.addElement({
        type: "image",
        src: "https://empresas.blogthinkbig.com/wp-content/uploads/2019/11/Imagen3-245003649.jpg?w=800",
        width: 400,
        height: 600
    });
};

const addSvg = () => {
    store.activePage?.addElement(getSvg());
};

const addPlaceholder = () => {
    store.activePage?.addElement({
        type: "image",
        src: "https://thumbs.dreamstime.com/b/no-thumbnail-image-placeholder-forums-blogs-websites-148010362.jpg",
        width: 400,
        height: 600,
        custom: {
            isPlaceholder: true
        }
    });
};

const addTags = (text: string) => {
    store.activePage.addElement({
        type: "text",
        x: 150,
        y: 150,
        fill: "grey",
        text,
        contentEditable: false,
        custom: {
            isTag: true
        }
    });
};

const handleOnSaveAsImage = async () => {
    const url = await store.toDataURL();
    console.log("🚀 ~ handleOnSaveAsImage ~ url:", url);
    store.saveAsImage();
};

const handleOnSaveAsPdf = () => {
    store.saveAsPDF();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TextAlertButton = observer(({element}: any) => {
    const {custom} = element;

    if (!custom?.isTag) return null;

    return (
        <Button
            onClick={() => {
                alert("Im tag!");
            }}
        >
            Alert Tag
        </Button>
    );
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ImageAlertButton = observer(({element}: any) => {
    const {custom} = element;

    if (!custom?.isPlaceholder) return null;

    return (
        <Button
            onClick={() => {
                alert("Im placeholder!");
            }}
        >
            Alert Placeholder
        </Button>
    );
});

const CustomSection = {
    name: "tags",
    Tab: (props) => (
        <SectionTab name="Tags" {...props}>
            T
        </SectionTab>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Panel: observer(({store: tagsStore}: any) => {
        const getLabelTag = (text: string) => `{{${text}}}`;

        return (
            <div style={{margin: "20px 0 0 0"}}>
                <p>Here we will define our own custom tab.</p>
                <p>Elements on the current page: {tagsStore.activePage?.children.length}</p>
                <button onClick={() => addTags(getLabelTag("title"))}>
                    {getLabelTag("title")}
                </button>
                <button onClick={() => addTags(getLabelTag("brand"))}>
                    {getLabelTag("brand")}
                </button>
                <button onClick={() => addTags(getLabelTag("price"))}>
                    {getLabelTag("price")}
                </button>
            </div>
        );
    })
};

const UploadSection = DEFAULT_SECTIONS.find((section) => section.name === "upload");
UploadSection.Panel = UploadPanel;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sections: any = [...DEFAULT_SECTIONS, CustomSection, TemplatesSection, GridSection];

const PolotnoPage = (): React.ReactElement => {
    return (
        <>
            <button onClick={() => console.log("element", store.selectedElements[0])}>
                log store element
            </button>
            <button onClick={() => console.log("json", getStoreJson())}>Log store</button>
            <button onClick={() => loadStoreToJson()}>Load store</button>
            <button onClick={() => addElement()}>Add image</button>
            <button onClick={() => addSvg()}>Add svg</button>
            <button onClick={() => addPlaceholder()}>Add placeholder</button>
            <button onClick={() => handleOnSaveAsImage()}>Save as Image</button>
            <button onClick={() => handleOnSaveAsPdf()}>Save as PDF</button>
            <PolotnoContainer style={{width: "100vw", height: "100vh"}}>
                <SidePanelWrap>
                    <SidePanel store={store} sections={sections} />
                </SidePanelWrap>
                <WorkspaceWrap>
                    <Toolbar
                        store={store}
                        downloadButtonEnabled
                        components={{TextAlertButton, ImageAlertButton}}
                    />
                    <Workspace store={store} pageControlsEnabled={true} />
                    <ZoomButtons store={store} />
                </WorkspaceWrap>
            </PolotnoContainer>
        </>
    );
};

export default PolotnoPage;
