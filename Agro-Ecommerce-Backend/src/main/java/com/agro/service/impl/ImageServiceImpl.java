package com.agro.service.impl;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.sql.rowset.serial.SerialBlob;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.agro.dto.ImageDto;
import com.agro.model.Image;
import com.agro.model.Product;
import com.agro.repository.ImageRepo;
import com.agro.service.ImageService;
import com.agro.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageRepo imageRepo;
    private final ProductService productService;

    /**
     * Retrieves an image by its id. If no image is found with the given id, a
     * RuntimeException is thrown.
     * @return the image
     */
    @Override
    public Image getImageById(Long id) {
        return imageRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found!"));
    }

    /**
     * Deletes an image by its id. If no image is found with the given id, a
     * RuntimeException is thrown.
     */
    @Override
    public void deleteImageById(Long id) {
        Image image = imageRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found!"));
        imageRepo.delete(image);
    }

    /**
     * Saves the given list of images and associates them with the product of the
     * given id. If no product is found with the given id, a RuntimeException is
     * thrown.
     * @return the list of saved images with id and download url
     */
    @Override
    public List<ImageDto> saveImages(Long productId, List<MultipartFile> files) {
        Product product = productService.getProductById(productId);

        List<ImageDto> savedImageDto = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                Image image = new Image();
                image.setFileName(file.getOriginalFilename());
                image.setFileType(file.getContentType());
                image.setImage(new SerialBlob(file.getBytes()));
                image.setProduct(product);

                String buildDownloadUrl = "/api/v1/images/image/download/";
                String downloadUrl = buildDownloadUrl + image.getId();
                image.setDownloadUrl(downloadUrl);
                Image savedImage = imageRepo.save(image);

                savedImage.setDownloadUrl(buildDownloadUrl + savedImage.getId());
                imageRepo.save(savedImage);

                ImageDto imageDto = new ImageDto();
                imageDto.setId(savedImage.getId());
                imageDto.setFileName(savedImage.getFileName());
                imageDto.setDownloadUrl(savedImage.getDownloadUrl());
                savedImageDto.add(imageDto);

            } catch (IOException | SQLException e) {
                throw new RuntimeException(e.getMessage());
            }
        }
        return savedImageDto;
    }

    /**
     * Updates an existing image with the given id. If no image is found with the
     * given id, a RuntimeException is thrown.
     */
    @Override
    public void updateImage(MultipartFile file, Long imageId) {
        Image image = getImageById(imageId);
        try {
            image.setFileName(file.getOriginalFilename());
            image.setFileType(file.getContentType());
            image.setImage(new SerialBlob(file.getBytes()));
            imageRepo.save(image);
        } catch (IOException | SQLException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

}
