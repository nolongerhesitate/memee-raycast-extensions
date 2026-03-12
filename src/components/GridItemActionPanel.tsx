import { ActionPanel, Action, showToast, Toast, Clipboard, open, useNavigation } from "@raycast/api";
import { Meme } from "../types";
import path from 'path';
import MemeDetail from "./MemeDetail";

type Props = {
  meme: Meme,
}

export default function GridItemActionPanel(props: Props) {
  const { meme } = props;
  const { push } = useNavigation();

  const handleCopyMemeAction = async () => {
    try {
      await Clipboard.copy({ file: meme.path });
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
          onAction={() => open(path.dirname(meme.path))}
        />
        {/* <Action */}
        {/*   title="Open in Detail View" */}
        {/*   shortcut={{ modifiers: ["cmd", "shift"], key: "d" }} */}
        {/*   onAction={() => { */}
        {/*     push(<MemeDetail meme={meme} />); */}
        {/*   }} */}
        {/* /> */}
        <Action.Push
          title="Open in Detail View"
          shortcut={{ modifiers: ["cmd", "shift"], key: "d" }}
          target={<MemeDetail meme={meme} />}
        />
      </ActionPanel.Section>

      <ActionPanel.Section>
        <Action.CopyToClipboard
          title="Copy File Path"
          content={meme.path}
          shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
        />
      </ActionPanel.Section>
    </ActionPanel>
  );
}