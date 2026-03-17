package expo.modules.safhelper

import android.net.Uri
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.HttpURLConnection
import java.net.URL

class SafHelperModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("SafHelper")

        Events("onProgress")

        AsyncFunction("downloadToSaf") { remoteUrl: String, destContentUri: String, headers: Map<String, String> ->
            val context = appContext.reactContext!!
            var connection: HttpURLConnection? = null
            try {
                connection = URL(remoteUrl).openConnection() as HttpURLConnection
                headers.forEach { (key, value) -> connection.setRequestProperty(key, value) }
                connection.connect()

                if (connection.responseCode !in 200..299) {
                    throw Exception("Download failed with status ${connection.responseCode}")
                }

                val totalBytes = connection.contentLengthLong
                val dest = context.contentResolver.openOutputStream(Uri.parse(destContentUri))
                    ?: throw Exception("Could not open output stream for $destContentUri")

                var bytesWritten = 0L
                val buffer = ByteArray(8 * 1024 * 1024)

                connection.inputStream.use { input ->
                    dest.use { output ->
                        var read: Int
                        while (input.read(buffer).also { read = it } != -1) {
                            output.write(buffer, 0, read)
                            bytesWritten += read
                            if (totalBytes > 0) {
                                sendEvent("onProgress", mapOf(
                                    "progress" to bytesWritten.toDouble() / totalBytes.toDouble()
                                ))
                            }
                        }
                    }
                }
            } finally {
                connection?.disconnect()
            }
        }
    }
}