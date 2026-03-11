import { useState, useEffect, useMemo } from "react";
import { Grid, getPreferenceValues, showToast, Toast } from "@raycast/api";
import { scanMemeFolder } from "./utils/fileScanner";
import { Preferences, Meme } from "./types";
import GridItemActionPanel from "./components/GridItemActionPanel";

// TODO: Create the revalidate function returnd by usePromise
export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  // const [columns, setColumns] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [memes, setMemes] = useState<Meme[]>([]);
  const [extensionFilter, setExtensionFilter] = useState<string>('all');

  useEffect(() => {
    const loadMemes = async () => {
      try {
        const memeFiles = await scanMemeFolder(preferences.memeDirectory);
        setMemes(memeFiles);
        showToast({
          style: Toast.Style.Success,
          title: "Directory Loaded",
          message: `Found ${memeFiles.length} memes from: ${preferences.memeDirectory}`,
        });
      } catch (error) {
        showToast({
          style: Toast.Style.Failure,
          title: "Failed to Load Directory",
          message: error instanceof Error ? error.message : "Unknown error occurred",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMemes();
  }, [preferences.memeDirectory]);

  const filteredMemes = useMemo(() => {
    if (extensionFilter === 'all') return memes;
    return memes?.filter(m => {
      if (extensionFilter === 'gifs') return m.extension === '.gif';
      if (extensionFilter === 'static') return ['.png', '.jpg', '.jpeg', '.webp'].includes(m.extension);
      return true;
    })
  }, [memes, extensionFilter])


  // TODO: Extract logic from UI:
  return (
    <Grid
      // columns={columns}
      inset={Grid.Inset.Zero}
      isLoading={isLoading}
      fit={Grid.Fit.Contain}
      searchBarAccessory={
        // <Grid.Dropdown
        //   tooltip="Grid Item Size"
        //   storeValue
        //   onChange={(newValue) => {
        //     setColumns(parseInt(newValue));
        //     setIsLoading(false);
        //   }}
        // >
        //   <Grid.Dropdown.Item title="Large" value={"3"} />
        //   <Grid.Dropdown.Item title="Medium" value={"5"} />
        //   <Grid.Dropdown.Item title="Small" value={"8"} />
        // </Grid.Dropdown>
        <Grid.Dropdown
          tooltip="Filter by Type"
          // Remebers user's last choice
          storeValue={true}
          onChange={(newValue) => setExtensionFilter(newValue)}
        >
          <Grid.Dropdown.Item title='All Images' value="all" />
          <Grid.Dropdown.Item title="GIFs Only" value="gifs" />
          <Grid.Dropdown.Item title="Static Images (PNG/JPG)" value='static' />
        </Grid.Dropdown>
      }
    >
      <Grid.EmptyView
        title="No Memes Found"
        description="Try adding some images to your folder."
      />

      {!isLoading &&
        filteredMemes?.map((meme: Meme) => {
          return (
            <Grid.Item
              key={meme.name}
              content={{ value: { source: meme.fullPath }, tooltip: meme.name }}
              title={meme.name}
              actions={<GridItemActionPanel meme={meme} />}
            />
          );
        })}
    </Grid>
  );
}
