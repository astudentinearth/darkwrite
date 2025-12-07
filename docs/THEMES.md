# Create your own theme

### 1. Copy the template below to a new file

```json
{
  "id": "your-unique-id-here",
  "name": "My Custom Theme",
  "mode": "dark",
  "colors": {
    "--foreground": "hsl(0 0% 100%)",
    "--background": "hsl(0 0% 5%)",
    "--view-1": "hsl(0 0% 6%)",
    "--view-2": "hsl(0 0% 11%)",
    "--card": "hsl(0 0% 13%)",
    "--card-foreground": "hsl(0 0% 94%)",
    "--popover": "hsl(0 0% 9%)",
    "--popover-foreground": "hsl(0 0% 94%)",
    "--secondary": "hsl(0 0% 20%)",
    "--secondary-foreground": "hsl(0 0% 100%)",
    "--muted": "hsl(0 0% 17%)",
    "--muted-foreground": "hsl(0 0% 89%)",
    "--destructive": "hsl(0 51% 55%)",
    "--destructive-foreground": "hsl(210 40% 98%)",
    "--disabled": "hsl(0 0% 22%)",
    "--border": "hsl(0 0% 14%)",
    "--ring": "hsl(212.7 26.8% 50%)",
    "--star": "hsl(50 97% 63%)",
    "--editor-text-red": "hsl(1 100% 66%)",
    "--editor-text-orange": "hsl(26 97% 61%)",
    "--editor-text-yellow": "hsl(54 100% 66%)",
    "--editor-text-green": "hsl(119 100% 66%)",
    "--editor-text-cyan": "hsl(166 100% 66%)",
    "--editor-text-blue": "hsl(202 97% 61%)",
    "--editor-text-indigo": "hsl(251 100% 60%)",
    "--editor-text-purple": "hsl(280 100% 60%)",
    "--editor-text-pink": "hsl(305 100% 60%)",
    "--editor-highlight-red": "hsl(1 100% 66% / 0.4)",
    "--editor-highlight-orange": "hsl(26 97% 61% / 0.4)",
    "--editor-highlight-yellow": "hsl(54 100% 66% / 0.4)",
    "--editor-highlight-green": "hsl(119 100% 66% / 0.4)",
    "--editor-highlight-cyan": "hsl(166 100% 66% / 0.4)",
    "--editor-highlight-blue": "hsl(202 97% 61% / 0.4)",
    "--editor-highlight-indigo": "hsl(251 100% 60% / 0.4)",
    "--editor-highlight-purple": "hsl(280 100% 60% / 0.4)",
    "--editor-highlight-pink": "hsl(305 100% 60% / 0.4)",
  }
}
```

### 2. Change the `id` field to something unique, like an UUID.

### 3. Choose a name for your theme.

### 4. Tweak the colors to your liking.

> [!NOTE]
> You can define your colors in any supported CSS color function. HSL is recommended for easier tweaking of colors, but you can also use HEX, RGB, or any other CSS color format. **Color values are validated for security.**

### 5. Set the `mode` field appropriately.

If your theme is for dark mode, set it to `"dark"`, otherwise set it to `"light"`. This will determine the colors of window decorations etc.

### 6. Save the file

Save it somewhere easily accessible like your desktop, but make sure the file extension is `.json`. For example, save it as `my theme.json`

### 7. Import your theme

Open Darkwrite, choose **Settings** from the sidebar. Under the **Appearance** category, choose **Import Theme**

Choose the file you saved earlier.

### 8. Apply your theme

Select your theme from the theme menu to apply it. Enjoy your very own theme🖌️🎨

## Where can I find my theme files?

Your themes are stored in `<userDataDir>/darkwrite-data/themes/`, where `<userDataDir>` is the app data directory determined by your OS. You can easily get there by choosing **Tools > Open data directory** from Darkwrite's menu. (click the Darkwrite logo on the top left of the window)
