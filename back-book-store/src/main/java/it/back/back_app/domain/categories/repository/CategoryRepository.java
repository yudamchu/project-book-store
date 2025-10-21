package it.back.back_app.domain.categories.repository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
@Transactional(readOnly = true)
public class CategoryRepository {

    @PersistenceContext
    private EntityManager em;

    public boolean existsByIdNative(Long id) {
        String sql = "SELECT COUNT(*) FROM categories WHERE category_id = :id";
        Number count = (Number) em.createNativeQuery(sql)
                .setParameter("id", id)
                .getSingleResult();
        return count.intValue() > 0;
    }
}
