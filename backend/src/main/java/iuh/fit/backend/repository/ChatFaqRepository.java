package iuh.fit.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import iuh.fit.backend.model.ChatFaq;

public interface ChatFaqRepository extends JpaRepository<ChatFaq, Integer> {

    // Find FAQ by category
    List<ChatFaq> findByCategoryAndIsActiveTrueOrderByPriorityDesc(String category);
    
    // Find all active FAQs
    List<ChatFaq> findByIsActiveTrueOrderByPriorityDesc();
    
    // Fulltext search by keywords (native query for MariaDB)
    @Query(value = "SELECT * FROM chat_faq WHERE is_active = true AND MATCH(keywords, question, answer) AGAINST(:keyword IN NATURAL LANGUAGE MODE) ORDER BY priority DESC LIMIT 5", nativeQuery = true)
    List<ChatFaq> searchByKeyword(@Param("keyword") String keyword);
    
    // Simple search using LIKE
    @Query("SELECT f FROM ChatFaq f WHERE f.isActive = true AND (LOWER(f.keywords) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(f.question) LIKE LOWER(CONCAT('%', :keyword, '%'))) ORDER BY f.priority DESC")
    List<ChatFaq> searchByKeywordLike(@Param("keyword") String keyword);
}
