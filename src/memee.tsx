import { useState, useEffect } from "react";
import { Grid, getPreferenceValues, showToast, Toast, ActionPanel, Action, Clipboard, open } from "@raycast/api";
import { scanMemeFolder } from "./utils/fileScanner";
import { Preferences, Meme } from "./types";
import path from 'path';

// TODO: Create the revalidate function returnd by usePromise
export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const [columns, setColumns] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [memes, setMemes] = useState<Meme[]>([]);

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


  // TODO: Extract logic from UI.
  return (
    <Grid
      columns={columns}
      inset={Grid.Inset.Zero}
      isLoading={isLoading}
      fit={Grid.Fit.Contain}
      searchBarAccessory={
        <Grid.Dropdown
          tooltip="Grid Item Size"
          storeValue
          onChange={(newValue) => {
            setColumns(parseInt(newValue));
            setIsLoading(false);
          }}
        >
          <Grid.Dropdown.Item title="Large" value={"3"} />
          <Grid.Dropdown.Item title="Medium" value={"5"} />
          <Grid.Dropdown.Item title="Small" value={"8"} />
        </Grid.Dropdown>
      }
    >
      <Grid.EmptyView
        title="No Memes Found"
        description="Try adding some images to your folder."
      />

      {!isLoading &&
        memes?.map((meme: Meme) => {
          return (
            <Grid.Item
              key={meme.name}
              content={{ value: { source: meme.fullPath }, tooltip: meme.name }}
              title={meme.name}
              actions={
                <ActionPanel>
                  <ActionPanel.Section>
                    <Action
                      title="Copy Meme"
                      onAction={async () => {
                        try {
                          await Clipboard.copy({ file: meme.fullPath });
                          await showToast({
                            style: Toast.Style.Success,
                            title: "Copied to clipboard",
                            message: meme.name,
                          });
                        } catch (error) {
                          await showToast({
                            style: Toast.Style.Failure,
                            title: "Failed to copy",
                            message: String(error),
                          });
                        }
                      }}
                    />
                    <Action
                      title="Show in Finder"
                      shortcut={{ modifiers: ["cmd"], key: "o" }}
                      onAction={() => open(path.dirname(meme.fullPath))}
                    />
                  </ActionPanel.Section>

                  <ActionPanel.Section>
                    <Action.CopyToClipboard
                      title="Copy File Path"
                      content={meme.fullPath}
                      shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
                    />
                  </ActionPanel.Section>
                </ActionPanel>
              }
            />
          );
        })}
    </Grid>
  );
}
