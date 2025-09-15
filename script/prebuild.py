#! /usr/bin/python3

keystore = '''{
            storeFile  file(keystoreProperties['KEYSTORE_PATH'])
            storePassword  keystoreProperties['KEYSTORE_PASSWORD']
            keyAlias keystoreProperties['KEY_ALIAS']
            keyPassword keystoreProperties['KEY_PASSWORD']
        }
'''
gradle_body = ''
with open('expo/android/app/build.gradle','r',encoding="utf-8") as read_handle:
    writing_keys = False
    keys_written = False
    for line in read_handle.readlines():
        if 'def projectRoot' in line:
            line += '''
def keystorePropertiesFile = System.getenv('SNOWTOME_KEYSTORE_PROPS')
def keystoreProperties = new Properties()
keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
'''
        if 'hermesCommand' in line and not '//' in line:
            line = '    hermesCommand = "/home/kretst/bin/hermes/hermesc"\n'

        if 'minSdkVersion' in line:
            line = '        minSdkVersion 26\n'

        if 'signingConfigs' in line and not keys_written:
            writing_keys = True
            gradle_body += line

        if writing_keys and '}' in line:
            line = f'        debug {keystore}\n        release {keystore}'
            signing_found = writing_keys = False
            keys_written = True
        if not writing_keys:
            gradle_body += line

with open('expo/android/app/build.gradle', 'w', encoding="utf-8") as write_handle:
    write_handle.write(gradle_body)