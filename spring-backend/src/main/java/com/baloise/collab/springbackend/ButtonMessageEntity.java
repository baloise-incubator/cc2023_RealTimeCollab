package com.baloise.collab.springbackend;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Entity
@Table(name="button")
public class ButtonMessageEntity {

    @Setter
    private String userName;
    @Id
    private Long id;

    public void setId(Long id) {
        this.id = id;
    }

}
