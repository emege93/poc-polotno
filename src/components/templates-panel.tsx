import React from "react";
import {observer} from "mobx-react-lite";
import {useInfiniteAPI} from "polotno/utils/use-api";

import {SectionTab} from "polotno/side-panel";
import MdPhotoLibrary from "@meronex/icons/md/MdPhotoLibrary";

import {ImagesGrid} from "polotno/side-panel/images-grid";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TemplatesPanel = observer(({store}: any) => {
    // load data
    const {data, isLoading} = useInfiniteAPI({
        getAPI: ({page}) => {
            return `templates/page${page}.json`;
        }
    });

    return (
        <div style={{height: "100%"}}>
            <ImagesGrid
                shadowEnabled={false}
                images={data?.map((imageData) => imageData.items).flat()}
                getPreview={(item) => `/templates/${item.preview}`}
                isLoading={isLoading}
                onSelect={async (item) => {
                    // download selected json
                    const req = await fetch(`/templates/${item.json}`);
                    const json = await req.json();
                    // just inject it into store
                    store.loadJSON(json);
                }}
                rowsNumber={2}
            />
        </div>
    );
});

// define the new custom section
export const TemplatesSection = {
    name: "custom-templates",
    Tab: (props) => (
        <SectionTab name="Custom templates" {...props}>
            <MdPhotoLibrary />
        </SectionTab>
    ),
    // we need observer to update component automatically on any store changes
    Panel: TemplatesPanel
};
