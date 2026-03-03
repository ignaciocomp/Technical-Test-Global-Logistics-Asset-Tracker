using FluentValidation;
using GLAT.Application.DTOs;

namespace GLAT.Application.Common.Validators;

public class CreateAssetValidator : AbstractValidator<CreateAssetRequest>
{
    private static readonly string[] ValidTypes = ["container", "vehicle", "machinery"];
    private static readonly string[] ValidStatuses = ["active", "maintenance", "inactive"];

    public CreateAssetValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().MaximumLength(200);

        RuleFor(x => x.Type)
            .NotEmpty()
            .Must(t => ValidTypes.Contains(t.ToLowerInvariant()))
            .WithMessage("Type must be one of: container, vehicle, machinery.");

        When(x => x.Status is not null, () =>
        {
            RuleFor(x => x.Status)
                .Must(s => ValidStatuses.Contains(s!.ToLowerInvariant()))
                .WithMessage("Status must be one of: active, maintenance, inactive.");
        });

        RuleFor(x => x.Location).NotNull();
        RuleFor(x => x.Location.Latitude).InclusiveBetween(-90, 90);
        RuleFor(x => x.Location.Longitude).InclusiveBetween(-180, 180);
    }
}
