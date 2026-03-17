package expo.modules.safcopy

import android.content.Context
import android.net.Uri
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File

class SafCopyModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("SafCopy")

        AsyncFunction("copyToSaf") { sourceUri: String, destContentUri: String ->
            val context = appContext.reactContext!!
            val source = File(Uri.parse(sourceUri).path!!)
            val dest = context.contentResolver.openOutputStream(Uri.parse(destContentUri))
                ?: throw Exception("Could not open output stream for $destContentUri")
            source.inputStream().use { input ->
                dest.use { output ->
                    input.copyTo(output, bufferSize = 8 * 1024 * 1024)
                }
            }
        }
    }
}