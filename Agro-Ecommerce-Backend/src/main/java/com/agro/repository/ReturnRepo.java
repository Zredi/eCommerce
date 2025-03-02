package com.agro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.agro.model.Order;
import com.agro.model.Return;
import com.agro.model.User;

public interface ReturnRepo extends JpaRepository<Return, Long> {

	List<Return> findByUser(User user);

	Return findByOrder(Order order);
}
