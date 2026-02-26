package com.schoolsync.repository;

import com.schoolsync.entity.Admission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdmissionRepository extends JpaRepository<Admission, Long> {
    Optional<Admission> findByEmailAndPhone(String email, String phone);

    Optional<Admission> findByEmail(String email);

    Optional<Admission> findByPhone(String phone);

    boolean existsByRollNumber(String rollNumber);
}
