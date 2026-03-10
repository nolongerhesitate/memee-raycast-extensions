import { ActionPanel, Action, showToast, Toast, Clipboard, open } from "@raycast/api";
import { Meme } from "../types";
import path from 'path';

type Props = {
  meme: Meme,
}

export default function GridItemActionPanel(props: Props) {
  const { meme } = props;

  const handleCopyMemeAction = async () => {
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
  };

  return (
    <ActionPanel>
      <ActionPanel.Section>
        <Action
          title="Copy Meme"
          onAction={handleCopyMemeAction}
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
  );
}