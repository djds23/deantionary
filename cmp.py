import subprocess


if __name__=='__main__':
    subprocess.call('jsx static/js/app.jsx >static/js/main.js', shell=True)
    from app import app
    app.run()
