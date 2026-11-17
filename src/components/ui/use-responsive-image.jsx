# Export all Microsoft 365 users
Connect-MgGraph -Scopes "User.Read.All"

$Users = Get-MgUser -All

$Users | Export-Csv `
    -Path ".\Microsoft365Users.csv" `
    -NoTypeInformation

Write-Host "Export completed successfully."