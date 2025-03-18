package org.example.controllers;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.example.services.FileService;

import java.util.List;

@Path("/files")
public class FileResource {

    @Inject
    FileService fileService;


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFilesList() {
        List<String> files = fileService.listFiles();
        return Response.ok(files)
                .header("Cache-Control", "public, max-age=3600")
                .build();
    }


    @GET
    @Path("/{fileName}")
    public Response getFile(@PathParam("fileName") String fileName) {
        try {
            byte[] fileData = fileService.getFileContent(fileName);

            MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM_TYPE;
            if (fileName.endsWith(".pdf")) {
                mediaType = MediaType.valueOf("application/pdf");
            } else if (fileName.endsWith(".txt")) {
                mediaType = MediaType.TEXT_PLAIN_TYPE;
            }

            return Response.ok(fileData, mediaType)
                    .header("Content-Disposition", "inline; filename=\"" + fileName + "\"")
                    .header("Cache-Control", "public, max-age=31536000, immutable")
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Файл не найден: " + fileName)
                    .build();
        }
    }
}
