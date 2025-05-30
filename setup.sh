export REPO_ROOT=$(dirname "$(realpath $0)")
pushd .

cd $REPO_ROOT
echo "Building common..."
yarn workspace @darkwrite/common build
echo "Building ui..."
yarn workspace @darkwrite/ui build
echo "Building editor..."
yarn workspace @darkwrite/editor build

if [[ $DW_WITHOUT_ELECTRON == 1 ]]; then
  echo "Skipping electron dependencies"
else
  echo "Installing electron dependencies"
  yarn workspace @darkwrite/app-desktop install_app_deps
fi

echo "Your development environment is ready."

popd