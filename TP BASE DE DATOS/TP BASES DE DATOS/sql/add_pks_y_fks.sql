alter table alumne add constraint alumne_pk primary key(id_alumne);

alter table materia add constraint materia_pk primary key(id_materia);

alter table correlatividad add constraint correlatividad_pk primary key(id_materia, id_mat_correlativa);
alter table correlatividad add constraint materia_id_materia_fk foreign key(id_materia) references materia(id_materia);

alter table comision add constraint comision_pk primary key(id_materia, id_comision);
alter table comision add constraint comision_id_materia_fk foreign key(id_materia) references materia(id_materia);

alter table cursada add constraint cursada_pk primary key(id_materia,id_alumne);
alter table cursada add constraint cursada_id_materia_fk foreign key(id_materia) references materia(id_materia); 
alter table cursada add constraint cursada_id_alumne_fk foreign key(id_alumne) references alumne(id_alumne);

alter table periodo add constraint periodo_pk primary key(semestre);

alter table historia_academica add constraint historia_academica_pk primary key(id_alumne,semestre,id_materia);
alter table historia_academica add constraint historia_academica_id_alumne_fk foreign key(id_alumne) references alumne(id_alumne);
alter table historia_academica add constraint historia_academica_semestre_fk foreign key(semestre) references periodo(semestre);
alter table historia_academica add constraint historia_academica_id_materia_fk foreign key(id_materia) references materia(id_materia); 

alter table error add constraint error_pk primary key(id_error); 

alter table envio_email add constraint envio_email_pk primary key(id_email);
