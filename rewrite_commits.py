import subprocess
import os

log = subprocess.check_output(['git', 'log', '--reverse', '--format=%H']).decode().strip().split('\n')

messages = [
    "initial commit hai",
    "production build ke liye imports fix kiye",
    "vercel deployment set kiya",
    "mobile gallery lightbox sahi kiya",
    "mobile par images render issue fix kiya",
    "animations ke liye framer-motion lagaya",
    "modal constraint fix kiya",
    "readme update kiya, supabase info hata di"
]

if len(log) == len(messages):
    print("Starting rewrite...")
    subprocess.check_call(['git', 'checkout', log[0]])
    subprocess.check_call(['git', 'commit', '--amend', '-m', messages[0]])
    
    for i in range(1, len(log)):
        print(f"Cherry picking {log[i]}")
        subprocess.check_call(['git', 'cherry-pick', log[i]])
        subprocess.check_call(['git', 'commit', '--amend', '-m', messages[i]])
    
    print("Updating main branch")
    subprocess.check_call(['git', 'branch', '-f', 'main', 'HEAD'])
    subprocess.check_call(['git', 'checkout', 'main'])
    print("Done!")
else:
    print(f"Mismatch in commit count: found {len(log)} commits, but provided {len(messages)} messages.")
