package ru.mpei.fqw.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "fault_current_info")
@Data
@NoArgsConstructor
public class FaultCurrentModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column
    private Double value;

    @Column
    private Integer time;

    @Column
    private Integer indexOfValues;

    public FaultCurrentModel(String name, Double value, Integer time, Integer indexOfValues) {
        this.name = name;
        this.value = value;
        this.time = time;
        this.indexOfValues = indexOfValues;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        FaultCurrentModel that = (FaultCurrentModel) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ", " +
                "name = " + name + ", " +
                "value = " + value + ", " +
                "time = " + time + ", " +
                "indexOfValues = " + indexOfValues + ")";
    }
}
