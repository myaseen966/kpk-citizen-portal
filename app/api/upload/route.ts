// API: POST /api/upload
// Handles file uploads and saves them to the public/uploads folder

import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
    }

    // Check file size — max 5MB
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Max size is 5MB.' }, { status: 400 })
    }

    // Allowed file types
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/jpg', 'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed. Use JPG, PNG, PDF or Word.' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads folder if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    // Create unique filename so files don't overwrite each other
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
    const fileName = `${timestamp}_${originalName}`
    const filePath = path.join(uploadDir, fileName)

    // Save file to disk
    await writeFile(filePath, buffer)

    // Return the URL that can be used to access the file
    const fileUrl = `/uploads/${fileName}`

    return NextResponse.json({
      message: 'File uploaded successfully!',
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed. Try again.' }, { status: 500 })
  }
}