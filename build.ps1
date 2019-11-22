ng build --prod --base-href /admin/

$archive = ".\dist\CubesManagement.zip"
if (test-path $archive) { Remove-Item $archive -Force }
Compress-Archive -Path .\dist\core-webapp\* -DestinationPath .\dist\CubesManagement.zip