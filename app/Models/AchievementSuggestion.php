<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\Notifiable;

class AchievementSuggestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'suggestion'
    ];

    public function suggester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
