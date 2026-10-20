' AiTron OS - demarrage sans fenetre noire.
' Verifie le port 3080, puis lance le serveur en arriere-plan en redirigeant
' la sortie vers K:\Reasonix-Temp-2\logs\web.log.
' Argument /silencieux : aucune boite de dialogue (utile pour un demarrage auto).
Option Explicit
Dim sh, root, cache, script, probe, answer, silent
Set sh = CreateObject("WScript.Shell")
root = "K:\AiTron-OS-Projet-DSH"
cache = "K:\Reasonix-Temp-2"
script = root + "\Lancer-AiTron-Silencieux.cmd"
silent = False
If WScript.Arguments.Count > 0 Then
  If LCase(WScript.Arguments(0)) = "/silencieux" Then silent = True
End If

probe = "powershell -NoProfile -Command ""if (Get-NetTCPConnection -LocalPort 3080 -State Listen -ErrorAction SilentlyContinue) { exit 1 } else { exit 0 }"""

If sh.Run(probe, 0, True) <> 0 Then
  If silent Then
    WScript.Quit 0
  End If
  answer = MsgBox("AiTron OS tourne deja sur http://127.0.0.1:3080" & vbCrLf & vbCrLf & "Voulez-vous l'arreter ?", 4 + 32, "AiTron OS")
  If answer = 6 Then
    sh.Run """" & root & "\Arreter-AiTron.cmd"" /silencieux", 0, True
  End If
  WScript.Quit 0
End If

sh.Run "cmd.exe /c " & script, 0, False
WScript.Sleep 5000

If sh.Run(probe, 0, True) <> 0 Then
  If Not silent Then
    MsgBox "AiTron OS demarre : http://127.0.0.1:3080", 64, "AiTron OS"
  End If
Else
  If Not silent Then
    MsgBox "Le demarrage a echoue. Consultez :" & vbCrLf & cache & "\logs\web.log", 16, "AiTron OS"
  End If
End If