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
            pnpm_12
            imagemagick # frequently used for conversions
          ];

          env = {
            ELECTRON_OVERRIDE_DIST_PATH =
              if pkgs.stdenv.hostPlatform.isDarwin then
                "${pkgs.electron_44}/bin"
              else
                "${pkgs.electron_44.dist}";
            ELECTRON_SKIP_BINARY_DOWNLOAD = "1";
          };
        };
      });
    };

}
