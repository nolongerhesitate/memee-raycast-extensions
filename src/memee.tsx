import { useState, useEffect } from "react";
import { ActionPanel, Action, Icon, Grid, Color, getPreferenceValues, showToast, Toast } from "@raycast/api";

interface Preferences {
  memeDirectory: string;
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const [columns, setColumns] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading memes from the configured directory
    setTimeout(() => {
      setIsLoading(false);
      showToast({
        style: Toast.Style.Success,
        title: "Directory Loaded",
        message: `Memes from: ${preferences.memeDirectory}`,
      });
    }, 1000);
  }, [preferences.memeDirectory]);
  return (
    <Grid
      columns={columns}
      inset={Grid.Inset.Large}
      isLoading={isLoading}
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
      {!isLoading &&
        Object.entries(Icon).map(([name, icon]) => (
          <Grid.Item
            key={name}
            content={{ value: { source: icon, tintColor: Color.PrimaryText }, tooltip: name }}
            title={name}
            subtitle={icon}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard content={icon} />
              </ActionPanel>
            }
          />
        ))}
    </Grid>
  );
}
