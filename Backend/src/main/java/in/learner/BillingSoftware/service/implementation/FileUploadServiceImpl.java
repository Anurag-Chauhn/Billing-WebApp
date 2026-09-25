package in.learner.BillingSoftware.service.implementation;

import in.learner.BillingSoftware.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileUploadServiceImpl implements FileUploadService {

    @Value("${aws.bucket.name}")
    private String bucketName;

    private final S3Client s3Client;

    @Override
    public String uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No file was uploaded");
        }

        // FIX: original NPE'd on a null filename and on a filename with no extension.
        String originalName = file.getOriginalFilename();
        String key = UUID.randomUUID().toString();
        if (originalName != null) {
            int dot = originalName.lastIndexOf('.');
            if (dot > -1 && dot < originalName.length() - 1) {
                key = key + "." + originalName.substring(dot + 1);
            }
        }

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            PutObjectResponse putObjectResponse =
                    s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

            if (putObjectResponse.sdkHttpResponse().isSuccessful()) {
                return "https://" + bucketName + ".s3.amazonaws.com/" + key;
            }
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "An error occurred while uploading the image");
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "An error occurred while uploading the file: " + e.getMessage());
        }
    }

    @Override
    public boolean deleteFile(String imgUrl) {
        // FIX: NPE when a category had no image.
        if (imgUrl == null || imgUrl.isBlank()) {
            return false;
        }

        String filename = imgUrl.substring(imgUrl.lastIndexOf('/') + 1);
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(filename)
                .build());
        return true;
    }
}
