package com.agro.repository;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

import com.agro.model.Image;

public interface ImageRepo extends JpaRepository<Image, Long>{

    List<Image> findByProductId(Long id);

}
