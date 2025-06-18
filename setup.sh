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

  if [ -x "$(command -v pacman)" ]; then
    echo "Installing python-setuptools with pacman..."
    sudo pacman -Sy python-setuptools
  elif [ -x "$(command -v apt)" ]; then
    echo "Updating APT package lists..."
    sudo apt update -y
    echo "Installing python3-setuptools with APT..."
    sudo apt install python3-setuptools
  elif [ -x "$(command -v dnf)" ]; then
    echo "Installing python3-setuptools with dnf..."
    sudo dnf install python3-setuptools
  elif [ -x "$(command -v pip)" ]; then
    echo "Could not find a comptaible distribution package manager. Try installing python setuptools with pip? (Hit y or n)"
    read -r SETUPTOOLS_RESPONSE
    if [[ $SETUPTOOLS_RESPONSE == "y" ]]; then
      pip install setuptools
    fi
  else
    echo "!! We couldn't install python-setuptools for you. Ensure it is installed if Electron Builder fails."
  fi

  echo "Installing electron dependencies"
  yarn workspace @darkwrite/app-desktop install_app_deps
fi

echo "Your development environment is ready."

popd