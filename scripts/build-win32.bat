set PLATFORM=%1%
set ARCH=%2%


set ignore_list="dist|scripts|\.idea|.*\.md|.*\.yml|node_modules"

electron-packager .  --platform=%PLATFORM% --arch=%ARCH%  --app-version=0.0.1 --asar --icon=assets\app-icon\win\comics.ico --overwrite --out=.\out --ignore=%ignore_list%
