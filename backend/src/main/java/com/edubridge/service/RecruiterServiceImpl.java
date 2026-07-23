package com.edubridge.service;

import com.edubridge.dto.InternshipDto;
import com.edubridge.dto.JobDto;
import com.edubridge.dto.RecruiterProfileDto;
import com.edubridge.dto.StudentMatchDto;
import com.edubridge.entity.*;
import com.edubridge.exception.ResourceNotFoundException;
import com.edubridge.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RecruiterServiceImpl implements RecruiterService {

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Override
    public RecruiterProfileDto getRecruiterProfile(Long recruiterId) {
        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found for ID: " + recruiterId));
        return mapToDto(recruiter);
    }

    @Override
    @Transactional
    public RecruiterProfileDto updateRecruiterProfile(Long recruiterId, RecruiterProfileDto dto) {
        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found for ID: " + recruiterId));

        recruiter.setFirstName(dto.getFirstName());
        recruiter.setLastName(dto.getLastName());
        recruiter.setPhone(dto.getPhone());
        recruiter.setCompanyName(dto.getCompanyName());
        recruiter.setDesignation(dto.getDesignation());

        Recruiter updated = recruiterRepository.save(recruiter);
        return mapToDto(updated);
    }

    // JOB CRUD IMPLEMENTATIONS
    @Override
    @Transactional
    public JobDto postJob(Long recruiterId, JobDto jobDto) {
        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found for ID: " + recruiterId));

        Job job = Job.builder()
                .title(jobDto.getTitle())
                .description(jobDto.getDescription())
                .companyName(jobDto.getCompanyName())
                .location(jobDto.getLocation())
                .salaryRange(jobDto.getSalaryRange())
                .recruiter(recruiter)
                .requiredSkills(mapSkillNamesToEntities(jobDto.getRequiredSkills()))
                .status("ACTIVE")
                .postedDate(java.time.LocalDateTime.now())
                .build();

        Job saved = jobRepository.save(job);
        return mapToJobDto(saved);
    }

    @Override
    @Transactional
    public JobDto updateJob(Long jobId, JobDto jobDto) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job post not found for ID: " + jobId));

        job.setTitle(jobDto.getTitle());
        job.setDescription(jobDto.getDescription());
        job.setCompanyName(jobDto.getCompanyName());
        job.setLocation(jobDto.getLocation());
        job.setSalaryRange(jobDto.getSalaryRange());
        job.setRequiredSkills(mapSkillNamesToEntities(jobDto.getRequiredSkills()));
        if (jobDto.getStatus() != null) {
            job.setStatus(jobDto.getStatus());
        }

        Job updated = jobRepository.save(job);
        return mapToJobDto(updated);
    }

    @Override
    @Transactional
    public void deleteJob(Long jobId) {
        if (!jobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job post not found for ID: " + jobId);
        }
        jobRepository.deleteById(jobId);
    }

    @Override
    public List<JobDto> getJobsByRecruiter(Long recruiterId) {
        return jobRepository.findByRecruiterId(recruiterId).stream()
                .map(this::mapToJobDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobDto> getAllJobs() {
        return jobRepository.findAllWithSkills().stream()
                .map(this::mapToJobDto)
                .collect(Collectors.toList());
    }

    @Override
    public JobDto getJobById(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job post not found for ID: " + jobId));
        return mapToJobDto(job);
    }

    // INTERNSHIP CRUD IMPLEMENTATIONS
    @Override
    @Transactional
    public InternshipDto postInternship(Long recruiterId, InternshipDto internshipDto) {
        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found for ID: " + recruiterId));

        Internship internship = Internship.builder()
                .title(internshipDto.getTitle())
                .description(internshipDto.getDescription())
                .companyName(internshipDto.getCompanyName())
                .location(internshipDto.getLocation())
                .durationMonths(internshipDto.getDurationMonths())
                .stipend(internshipDto.getStipend())
                .recruiter(recruiter)
                .requiredSkills(mapSkillNamesToEntities(internshipDto.getRequiredSkills()))
                .status("ACTIVE")
                .postedDate(java.time.LocalDateTime.now())
                .build();

        Internship saved = internshipRepository.save(internship);
        return mapToInternshipDto(saved);
    }

    @Override
    @Transactional
    public InternshipDto updateInternship(Long internshipId, InternshipDto dto) {
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found for ID: " + internshipId));

        internship.setTitle(dto.getTitle());
        internship.setDescription(dto.getDescription());
        internship.setCompanyName(dto.getCompanyName());
        internship.setLocation(dto.getLocation());
        internship.setDurationMonths(dto.getDurationMonths());
        internship.setStipend(dto.getStipend());
        internship.setRequiredSkills(mapSkillNamesToEntities(dto.getRequiredSkills()));
        if (dto.getStatus() != null) {
            internship.setStatus(dto.getStatus());
        }

        Internship updated = internshipRepository.save(internship);
        return mapToInternshipDto(updated);
    }

    @Override
    @Transactional
    public void deleteInternship(Long internshipId) {
        if (!internshipRepository.existsById(internshipId)) {
            throw new ResourceNotFoundException("Internship not found for ID: " + internshipId);
        }
        internshipRepository.deleteById(internshipId);
    }

    @Override
    public List<InternshipDto> getInternshipsByRecruiter(Long recruiterId) {
        return internshipRepository.findByRecruiterId(recruiterId).stream()
                .map(this::mapToInternshipDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<InternshipDto> getAllInternships() {
        return internshipRepository.findAllWithSkills().stream()
                .map(this::mapToInternshipDto)
                .collect(Collectors.toList());
    }

    @Override
    public InternshipDto getInternshipById(Long internshipId) {
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found for ID: " + internshipId));
        return mapToInternshipDto(internship);
    }

    // STUDENT SEARCH ALGORITHM
    @Override
    public List<StudentMatchDto> searchStudentsBySkills(List<String> searchSkillNames) {
        if (searchSkillNames == null || searchSkillNames.isEmpty()) {
            return studentRepository.findAllWithSkills().stream()
                    .map(s -> mapToMatchDto(s, 100))
                    .collect(Collectors.toList());
        }

        List<String> cleanSearchNames = searchSkillNames.stream()
                .map(String::toLowerCase)
                .map(String::trim)
                .collect(Collectors.toList());

        List<Student> students = studentRepository.findAllWithSkills();

        return students.stream()
                .map(student -> {
                    Set<String> studentSkills = student.getSkills().stream()
                            .map(Skill::getName)
                            .map(String::toLowerCase)
                            .collect(Collectors.toSet());

                    long matchCount = cleanSearchNames.stream()
                            .filter(studentSkills::contains)
                            .count();

                    int score = (int) (((double) matchCount / cleanSearchNames.size()) * 100);
                    return mapToMatchDto(student, score);
                })
                .filter(dto -> dto.getMatchPercentage() > 0)
                .sorted((a, b) -> Integer.compare(b.getMatchPercentage(), a.getMatchPercentage()))
                .collect(Collectors.toList());
    }

    // HELPER MAPPERS
    private Set<Skill> mapSkillNamesToEntities(Set<String> skillNames) {
        Set<Skill> skills = new HashSet<>();
        if (skillNames != null) {
            for (String name : skillNames) {
                if (name == null || name.trim().isEmpty()) continue;
                String normalized = name.trim();
                Skill skill = skillRepository.findByName(normalized)
                        .orElseGet(() -> skillRepository.save(Skill.builder().name(normalized).build()));
                skills.add(skill);
            }
        }
        return skills;
    }

    private RecruiterProfileDto mapToDto(Recruiter r) {
        return RecruiterProfileDto.builder()
                .id(r.getId())
                .email(r.getUser().getEmail())
                .firstName(r.getFirstName())
                .lastName(r.getLastName())
                .phone(r.getPhone())
                .companyName(r.getCompanyName())
                .designation(r.getDesignation())
                .build();
    }

    private JobDto mapToJobDto(Job j) {
        Set<String> skills = j.getRequiredSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());
        String recName = j.getRecruiter() != null ? (j.getRecruiter().getFirstName() + " " + j.getRecruiter().getLastName()) : "Unknown";

        return JobDto.builder()
                .id(j.getId())
                .title(j.getTitle())
                .description(j.getDescription())
                .companyName(j.getCompanyName())
                .location(j.getLocation())
                .salaryRange(j.getSalaryRange())
                .requiredSkills(skills)
                .recruiterId(j.getRecruiter() != null ? j.getRecruiter().getId() : null)
                .recruiterName(recName)
                .status(j.getStatus())
                .postedDate(j.getPostedDate())
                .build();
    }

    private InternshipDto mapToInternshipDto(Internship i) {
        Set<String> skills = i.getRequiredSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());
        String recName = i.getRecruiter() != null ? (i.getRecruiter().getFirstName() + " " + i.getRecruiter().getLastName()) : "Unknown";

        return InternshipDto.builder()
                .id(i.getId())
                .title(i.getTitle())
                .description(i.getDescription())
                .companyName(i.getCompanyName())
                .location(i.getLocation())
                .durationMonths(i.getDurationMonths())
                .stipend(i.getStipend())
                .requiredSkills(skills)
                .recruiterId(i.getRecruiter() != null ? i.getRecruiter().getId() : null)
                .recruiterName(recName)
                .status(i.getStatus())
                .postedDate(i.getPostedDate())
                .build();
    }

    private StudentMatchDto mapToMatchDto(Student s, int score) {
        Set<String> skills = s.getSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());

        return StudentMatchDto.builder()
                .studentId(s.getId())
                .firstName(s.getFirstName())
                .lastName(s.getLastName())
                .skills(skills)
                .currentEducation(s.getCurrentEducation())
                .institution(s.getInstitution())
                .matchPercentage(score)
                .build();
    }
}
