@echo off

where /q wget
if errorlevel 1 (
	echo ERROR: Unable to find wget in the PATH !
	echo.
	echo You need to install it to download the files with this script.
	echo If you don't want to, got to [URL].
	echo.
	echo I am sorry for this, but Microsoft hasn't release a GOOD version of the wget command yet.
	echo And I don't want to do a powershell script for this, I still value my life.
	goto eof
)

echo Current parameters:
echo Speed-limit: 2M
echo Save folder: .\app\data\
echo wget quiet mode: enabled


:ask-stations
echo.
echo Do you want to download the stations.json file ?(Y/N)
set INPUT=
set /P INPUT=
If /I "%INPUT%"=="y" goto download-stations
If /I "%INPUT%"=="n" goto ask-popsys
echo Incorrect input & goto ask-stations
:download-stations
echo Downloading stations infos...
wget --limit-rate=2M --no-check-certificate -O ./app/data/stations.json https://eddb.io/archive/v5/stations.json -q


:ask-popsys
echo.
echo Do you want to download the systems_populated.json file ?(Y/N)
set INPUT=
set /P INPUT=
If /I "%INPUT%"=="y" goto download-popsys
If /I "%INPUT%"=="n" goto eof
echo Incorrect input & goto ask-popsys
:download-popsys
echo Downloading populated systems infos...
wget --limit-rate=2M --no-check-certificate -O ./app/data/systems_populated.json https://eddb.io/archive/v5/systems_populated.json -q


:eof
echo.
pause