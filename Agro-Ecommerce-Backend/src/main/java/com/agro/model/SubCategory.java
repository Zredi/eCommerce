package com.agro.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@NoArgsConstructor 
@Entity 
@Table(name = "subcategories") 
public class SubCategory { 
	@Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY) 
	private Long id; 
	private String name;
	
	@ManyToOne 
	@JoinColumn(name = "category_id", nullable=false) 
	private Category category; 
	
	@JsonIgnore
	@OneToMany(mappedBy = "subCategory", cascade = CascadeType.ALL, orphanRemoval = true) 
	private List<Product> products; 
	public SubCategory(String name, Category category) { 
		this.name = name; 
		this.category = category; 
		} 
	}
