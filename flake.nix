{
  description = "Nix-based Darkwrite development environment";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { self, nixpkgs, ... }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-darwin"
        "aarch64-linux"
      ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages."${system}");
    in
    {
      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_24
            electron_44
            python312
            node-gyp
            zsh
            imagemagick # frequently used for conversions
          ];

          env = {
            # Electron 44 will be provided by Nix, no need to download extra
            ELECTRON_OVERRIDE_DIST_PATH = "${pkgs.electron_44.dist}";
            ELECTRON_SKIP_BINARY_DOWNLOAD = "1";
          };
        };
      });
    };

}
